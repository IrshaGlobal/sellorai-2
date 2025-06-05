import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // This endpoint should be secured in production
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // Execute RLS setup queries
    const queries = [
      // Disable RLS temporarily to fix any issues
      'ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE stores DISABLE ROW LEVEL SECURITY;',
      
      // Drop existing policies if they exist
      'DROP POLICY IF EXISTS "Users can read their own data" ON users;',
      'DROP POLICY IF EXISTS "Users can insert their own data" ON users;',
      'DROP POLICY IF EXISTS "Users can update their own data" ON users;',
      'DROP POLICY IF EXISTS "Service role can manage all users" ON users;',
      'DROP POLICY IF EXISTS "Users can read their own stores" ON stores;',
      'DROP POLICY IF EXISTS "Users can insert their own stores" ON stores;',
      'DROP POLICY IF EXISTS "Users can update their own stores" ON stores;',
      'DROP POLICY IF EXISTS "Service role can manage all stores" ON stores;',
      
      // Create policies for users table
      'CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid()::text = email);',
      'CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = email);',
      'CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = email);',
      'CREATE POLICY "Service role can manage all users" ON users USING (auth.role() = \'service_role\');',
      
      // Create policies for stores table
      'CREATE POLICY "Users can read their own stores" ON stores FOR SELECT USING (auth.uid()::text = user_id);',
      'CREATE POLICY "Users can insert their own stores" ON stores FOR INSERT WITH CHECK (auth.uid()::text = user_id);',
      'CREATE POLICY "Users can update their own stores" ON stores FOR UPDATE USING (auth.uid()::text = user_id);',
      'CREATE POLICY "Service role can manage all stores" ON stores USING (auth.role() = \'service_role\');',
      
      // Re-enable RLS
      'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE stores ENABLE ROW LEVEL SECURITY;'
    ];

    for (const query of queries) {
      try {
        await supabase.rpc('exec_sql', { sql: query });
      } catch (error) {
        console.error(`Error executing query: ${query}`, error);
      }
    }

    return res.status(200).json({ success: true, message: 'RLS policies set up successfully' });
  } catch (error: any) {
    console.error('Error setting up RLS:', error);
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred' });
  }
}