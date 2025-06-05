import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil' as any,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Verify authentication
  const user = await isAuthenticated(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { storeId, plan = 'launch' } = req.body;

    if (!storeId) {
      return res.status(400).json({ success: false, message: 'Store ID is required' });
    }

    // Verify store belongs to user
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', user.email)
      .single();

    if (!store) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this store' });
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('store_id', storeId)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return res.status(400).json({ success: false, message: 'Subscription already exists' });
    }

    // Create Stripe customer if not exists
    let customerId = store.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: store.name,
        metadata: {
          storeId: storeId
        }
      });
      
      customerId = customer.id;
      
      // Update store with customer ID
      await supabase
        .from('stores')
        .update({ stripe_customer_id: customerId })
        .eq('id', storeId);
    }

    // Get price ID based on plan
    const priceId = process.env.STRIPE_PRICE_ID || 'price_1234'; // Replace with actual price ID

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=canceled`,
      metadata: {
        storeId: storeId
      }
    });

    return res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}