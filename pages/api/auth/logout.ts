import type { NextApiRequest, NextApiResponse } from 'next';

type LogoutResponse = {
  success: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  // Clear the auth cookie
  res.setHeader('Set-Cookie', 'auth=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');

  return res.status(200).json({ success: true });
}