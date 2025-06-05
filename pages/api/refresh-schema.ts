// pages/api/refresh-schema.ts
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
    // Force refresh the schema cache
    await supabase.rpc('refresh_schema_cache');

    return res.status(200).json({
      success: true,
      message: 'Schema cache refreshed successfully'
    });
  } catch (error: any) {
    console.error('Schema refresh error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An unexpected error occurred'
    });
  }
}