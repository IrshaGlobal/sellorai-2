import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { signUpWithEmail } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password, storeName } = req.body;

    if (!email || !password || !storeName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and store name are required' 
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if email already exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Generate subdomain from store name
    const subdomain = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Check if subdomain already exists
    const { data: existingStore } = await supabase
      .from('stores')
      .select('subdomain')
      .eq('subdomain', subdomain)
      .single();

    if (existingStore) {
      return res.status(400).json({ 
        success: false, 
        message: 'Store name already taken' 
      });
    }

    // Create user in Supabase Auth
    const { session, user: authUser } = await signUpWithEmail(email, password);
    
    if (!authUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    // Use admin client if available to bypass RLS
    const dbClient = supabaseAdmin || supabase;
    
    // Create user in our database
    const { error: userError } = await dbClient
      .from('users')
      .insert([{ email, role: 'vendor' }]);

    if (userError) {
      console.error('Error creating user record:', userError);
    }

    // Create store
    const { data: store, error: storeError } = await dbClient
      .from('stores')
      .insert([
        {
          name: storeName,
          subdomain,
          contact_email: email,
          user_id: email,
          description: `Welcome to ${storeName}!`,
          primary_color: '#3B82F6'
        }
      ])
      .select()
      .single();

    if (storeError) throw storeError;

    if (session) {
      // Set the session cookies if we have a session
      res.setHeader('Set-Cookie', `sb-access-token=${session.access_token}; Path=/; HttpOnly; Max-Age=${session.expires_in}; SameSite=Strict`);
      res.setHeader('Set-Cookie', `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Max-Age=${session.expires_in * 2}; SameSite=Strict`);
    }

    return res.status(201).json({
      success: true,
      user: { email, role: 'vendor' },
      store: { id: store.id, name: store.name, subdomain: store.subdomain }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An unexpected error occurred'
    });
  }
}