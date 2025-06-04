import { NextApiRequest } from 'next';

export interface AuthUser {
  email: string;
  storeId: string;
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: NextApiRequest): AuthUser | null {
  try {
    // Get token from cookie or Authorization header
    const authCookie = req.cookies.auth;
    const authHeader = req.headers.authorization?.split(' ')[1];
    const token = authCookie || authHeader;

    if (!token) {
      return null;
    }

    // Decode token (in production, we would verify JWT signature)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      email: payload.userId,
      storeId: payload.storeId
    };
  } catch (error) {
    return null;
  }
}

// Function to get auth token from cookies or headers
export function getAuthToken(req: NextApiRequest): string | null {
  const authCookie = req.cookies.auth;
  const authHeader = req.headers.authorization?.split(' ')[1];
  return authCookie || authHeader || null;
}