import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

type UserResponse = {
  success: boolean;
  user?: {
    email: string;
    storeId: string;
    storeName?: string;
    role?: string;
  };
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const authUser = await isAuthenticated(req);

    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Get user from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', authUser.email)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get store information
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id, name')
      .eq('user_id', authUser.email)
      .single();

    // Even if store is not found, we still return the user
    const user = {
      email: userData.email,
      role: userData.role,
      storeId: storeData?.id || '',
      storeName: storeData?.name
    };

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}