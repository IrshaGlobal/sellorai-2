import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { signInWithEmail } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
      // Authenticate with Supabase Auth
      const { session } = await signInWithEmail(email, password);
      
      if (!session) {
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      }
      
      // Set the session cookie
      res.setHeader('Set-Cookie', `sb-access-token=${session.access_token}; Path=/; HttpOnly; Max-Age=${session.expires_in}; SameSite=Strict`);
      res.setHeader('Set-Cookie', `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Max-Age=${session.expires_in * 2}; SameSite=Strict`);
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      return res.status(401).json({ success: false, message: authError.message || 'Invalid email or password' });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', email)
      .single();

    if (userError) {
      // If user doesn't exist in our custom table, create it
      if (userError.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ email, role: 'vendor' }])
          .select()
          .single();
          
        if (createError) {
          throw createError;
        }
      } else {
        throw userError;
      }
    }

    // Get user's store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, name, subdomain')
      .eq('user_id', email)
      .single();

    return res.status(200).json({
      success: true,
      user: { email, role: user?.role || 'vendor' },
      store: store ? { id: store.id, name: store.name, subdomain: store.subdomain } : null
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred' });
  }
}