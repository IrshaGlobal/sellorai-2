import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

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

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, password_hash, role')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Get user's store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, name, subdomain')
      .eq('user_id', email)
      .single();

    // Create JWT token
    const token = Buffer.from(JSON.stringify({
      userId: email,
      storeId: store?.id,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');

    // Set cookie
    res.setHeader('Set-Cookie', `auth=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);

    return res.status(200).json({
      success: true,
      user: { email, role: user.role },
      store: store ? { id: store.id, name: store.name, subdomain: store.subdomain } : null
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}