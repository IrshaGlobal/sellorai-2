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
    const { email, password, storeName } = req.body;

    if (!email || !password || !storeName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and store name are required' 
      });
    }

    // Check if email already exists
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([
        { email, password_hash: hashedPassword, role: 'vendor' }
      ])
      .select()
      .single();

    if (userError) throw userError;

    // Create store
    const { data: store, error: storeError } = await supabase
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

    // Create JWT token
    const token = Buffer.from(JSON.stringify({
      userId: email,
      storeId: store.id,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');

    // Set cookie
    res.setHeader('Set-Cookie', `auth=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);

    return res.status(201).json({
      success: true,
      user: { email },
      store: { id: store.id, name: store.name, subdomain: store.subdomain }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}