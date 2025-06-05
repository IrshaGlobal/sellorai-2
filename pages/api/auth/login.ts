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

    let session;
    try {
      // Authenticate with Supabase Auth
      const authResponse = await signInWithEmail(email, password);
      session = authResponse.session;
      
      if (!session || !session.user) { // Also check session.user
        return res.status(401).json({ success: false, message: 'Authentication failed or user data missing' });
      }
      
      // Set the session cookie
      res.setHeader('Set-Cookie', `sb-access-token=${session.access_token}; Path=/; HttpOnly; Max-Age=${session.expires_in}; SameSite=Strict`);
      res.setHeader('Set-Cookie', `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Max-Age=${session.expires_in * 2}; SameSite=Strict`);
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      return res.status(401).json({ success: false, message: authError.message || 'Invalid email or password' });
    }

    const supabaseUser = session.user;
    let appUser; // This will hold the user from our 'users' table

    // Get user from our database using UUID
    const { data: existingAppUser, error: userFetchError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', supabaseUser.id)
      .single();

    if (userFetchError) {
      if (userFetchError.code === 'PGRST116') { // "No rows found"
        // User exists in Supabase Auth but not in our 'users' table, so create them
        const { data: newAppUser, error: createError } = await supabase
          .from('users')
          .insert([{ id: supabaseUser.id, email: supabaseUser.email, role: 'vendor' }])
          .select('id, email, role')
          .single();
          
        if (createError) {
          console.error('Error creating user record in our DB:', createError);
          return res.status(500).json({ success: false, message: 'Failed to initialize user account.' });
        }
        appUser = newAppUser;
      } else {
        // Another error occurred fetching the user
        console.error('Error fetching user from our DB:', userFetchError);
        return res.status(500).json({ success: false, message: 'Failed to retrieve user data.' });
      }
    } else {
      appUser = existingAppUser;
    }

    if (!appUser) {
      // Should not happen if logic above is correct
      console.error('User object (appUser) is null after fetch/create.');
      return res.status(500).json({ success: false, message: 'Failed to obtain user details.' });
    }

    // Get user's store using UUID
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, name, subdomain')
      .eq('user_id', supabaseUser.id) // Use supabaseUser.id (UUID)
      .single();

    // storeError is not necessarily critical, user might not have a store yet or it's a different issue.
    if (storeError && storeError.code !== 'PGRST116') {
        console.warn('Error fetching store:', storeError.message);
    }

    return res.status(200).json({
      success: true,
      user: { email: appUser.email, role: appUser.role }, // Use email and role from appUser
      store: store ? { id: store.id, name: store.name, subdomain: store.subdomain } : null
    });
  } catch (error: any) { // Catch any other unexpected errors
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred' });
  }
}