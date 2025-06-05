import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { transferToConnectedAccount } from '@/lib/stripe';

// Disable body parsing, need the raw body for Stripe webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil' as any,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as any);
        break;
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as any);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as any);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as any);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    // Extract metadata
    const storeId = paymentIntent.metadata.storeId;
    const customerEmail = paymentIntent.metadata.customerEmail;
    const items = JSON.parse(paymentIntent.metadata.items || '[]');
    
    if (!storeId || !customerEmail || !items.length) {
      throw new Error('Missing required metadata');
    }

    // Get store details
    const { data: store } = await supabase
      .from('stores')
      .select('id, name, stripe_account_id')
      .eq('id', storeId)
      .single();

    if (!store) {
      throw new Error('Store not found');
    }

    // Calculate platform fee (2% for MVP)
    const amount = paymentIntent.amount / 100; // Convert from cents
    const platformFeePercent = 0.02;
    const platformFee = amount * platformFeePercent;
    const vendorAmount = amount - platformFee;

    // Create order in database
    const { data: order } = await supabase
      .from('orders')
      .insert({
        store_id: storeId,
        customer_email: customerEmail,
        subtotal: amount,
        total: amount,
        payment_status: 'paid',
        order_status: 'pending',
        stripe_payment_intent_id: paymentIntent.id
      })
      .select()
      .single();

    if (!order) {
      throw new Error('Failed to create order');
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    await supabase.from('order_items').insert(orderItems);

    // Transfer funds to connected account (minus platform fee)
    if (store.stripe_account_id) {
      await transferToConnectedAccount(vendorAmount, store.stripe_account_id, {
        orderId: order.id,
        storeId: storeId
      });
    }

    console.log(`Order ${order.id} created successfully`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    // Check if this is a subscription checkout
    if (session.mode !== 'subscription' || !session.subscription) {
      return;
    }

    const storeId = session.metadata?.storeId;
    if (!storeId) {
      throw new Error('Missing store ID in session metadata');
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

    // Create subscription record in database
    await supabase.from('subscriptions').insert({
      store_id: storeId,
      stripe_subscription_id: subscription.id,
      plan_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    });

    console.log(`Subscription ${subscription.id} created for store ${storeId}`);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}

async function handleInvoicePaid(invoice: any) {
  try {
    if (!invoice.subscription) {
      return;
    }

    // Get subscription
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;

    // Find store by customer ID
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (!store) {
      throw new Error('Store not found for customer');
    }

    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription ${subscription.id} updated for store ${store.id}`);
  } catch (error) {
    console.error('Error handling invoice paid:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription ${subscription.id} updated`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled'
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription ${subscription.id} canceled`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}