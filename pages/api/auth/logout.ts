import type { NextApiRequest, NextApiResponse } from 'next';
import { signOut } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Sign out from Supabase Auth
    await signOut();
    
    // Clear the session cookies
    res.setHeader('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');
    res.setHeader('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');
    
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred' });
  }
}