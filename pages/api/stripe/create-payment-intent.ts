import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentIntent } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, storeId, items, customer } = req.body;

    if (!amount || !storeId || !items || !customer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get store details to find the connected Stripe account
    const { data: store } = await supabase
      .from('stores')
      .select('stripe_account_id')
      .eq('id', storeId)
      .single();

    if (!store || !store.stripe_account_id) {
      return res.status(400).json({ error: 'Store not found or Stripe not connected' });
    }

    // Create a payment intent
    const paymentIntent = await createPaymentIntent(amount, 'usd', {
      storeId,
      customerEmail: customer.email,
      items: JSON.stringify(items)
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: error.message });
  }
}