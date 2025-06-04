import type { NextApiRequest, NextApiResponse } from 'next';

type UserResponse = {
  success: boolean;
  user?: {
    email: string;
    storeId: string;
    storeName: string;
  };
  message?: string;
};

// Mock user database for MVP
const users = [
  {
    email: 'demo@sellor.ai',
    storeId: '1',
    storeName: 'Demo Store'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Get token from cookie or Authorization header
  const authCookie = req.cookies.auth;
  const authHeader = req.headers.authorization?.split(' ')[1];
  const token = authCookie || authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    // Decode token (in production, we would verify JWT signature)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    // Find user in mock database
    const user = users.find(u => u.email === payload.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}