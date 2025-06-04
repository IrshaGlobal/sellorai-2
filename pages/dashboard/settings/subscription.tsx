import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import SubscriptionButton from '@/components/SubscriptionButton';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function SubscriptionPage() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Get store data
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', user.email)
          .single();

        if (storeData) {
          setStore(storeData);

          // Get subscription data
          const { data: subscriptionData } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('store_id', storeData.id)
            .eq('status', 'active')
            .single();

          if (subscriptionData) {
            setSubscription(subscriptionData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Subscription - sellor.ai</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Subscription</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Current Plan</h2>
          </div>

          <div className="p-6">
            {subscription ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Launch Plan</h3>
                    <p className="text-gray-500">Active subscription</p>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <div className="flex justify-between mb-2">
                    <span>Billing period</span>
                    <span>Monthly</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Next billing date</span>
                    <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>$29.00 / month</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => router.push('/dashboard/settings/billing')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  You don't have an active subscription. Subscribe to our Launch Plan to start selling.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                  <h3 className="text-xl font-bold text-center mb-2">Launch Plan</h3>
                  <div className="flex justify-center items-baseline mb-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-center text-gray-500 mb-6">+ 2% transaction fee</p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      AI Product Creation
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Unlimited Products
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Custom Domain Support
                    </li>
                  </ul>

                  <div className="text-center">
                    {store && (
                      <SubscriptionButton 
                        storeId={store.id} 
                        buttonText="Subscribe Now" 
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}