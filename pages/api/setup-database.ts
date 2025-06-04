// pages/api/setup-database.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Create users table if it doesn't exist
    await supabase.rpc('create_users_table_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          email VARCHAR(255) PRIMARY KEY,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'vendor',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    // Create stores table if it doesn't exist
    await supabase.rpc('create_stores_table_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS stores (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          subdomain VARCHAR(100) NOT NULL UNIQUE,
          custom_domain VARCHAR(255) UNIQUE,
          logo_url VARCHAR(255),
          primary_color VARCHAR(7) DEFAULT '#3B82F6',
          description TEXT,
          contact_email VARCHAR(255) NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          stripe_account_id VARCHAR(255),
          stripe_customer_id VARCHAR(255),
          shipping_rate DECIMAL(10,2) DEFAULT 5.00,
          free_shipping_threshold DECIMAL(10,2),
          allow_cod BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    // Create demo account
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'demo@sellor.ai',
      password: 'password123',
    });

    if (authError && authError.message !== 'User already registered') {
      throw authError;
    }

    // Insert demo user into users table
    await supabase
      .from('users')
      .upsert([
        {
          email: 'demo@sellor.ai',
          password_hash: '$2a$10$demohashdemohashdemoha', // Placeholder hash
          role: 'vendor'
        }
      ]);

    // Create demo store
    await supabase
      .from('stores')
      .upsert([
        {
          name: 'Demo Store',
          subdomain: 'demo',
          contact_email: 'demo@sellor.ai',
          user_id: 'demo@sellor.ai',
          description: 'Welcome to Demo Store!'
        }
      ]);

    return res.status(200).json({
      success: true,
      message: 'Database setup completed successfully'
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}