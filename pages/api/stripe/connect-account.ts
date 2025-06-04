import type { NextApiRequest, NextApiResponse } from 'next';
import { createStripeAccount, createAccountLink } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const user = isAuthenticated(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get store ID from request
    const { storeId } = req.body;
    if (!storeId) {
      return res.status(400).json({ error: 'Store ID is required' });
    }

    // Verify store belongs to user
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (!store || store.user_id !== user.email) {
      return res.status(403).json({ error: 'Not authorized to access this store' });
    }

    // Create Stripe account if not exists
    if (!store.stripe_account_id) {
      const account = await createStripeAccount(user.email);
      
      // Update store with Stripe account ID
      await supabase
        .from('stores')
        .update({ stripe_account_id: account.id })
        .eq('id', storeId);
      
      // Create account link for onboarding
      const accountLink = await createAccountLink(
        account.id,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?refresh=true`,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`
      );
      
      return res.status(200).json({ url: accountLink.url });
    } else {
      // Account already exists, create new account link
      const accountLink = await createAccountLink(
        store.stripe_account_id,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?refresh=true`,
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`
      );
      
      return res.status(200).json({ url: accountLink.url });
    }
  } catch (error: any) {
    console.error('Error connecting Stripe account:', error);
    return res.status(500).json({ error: error.message });
  }
}