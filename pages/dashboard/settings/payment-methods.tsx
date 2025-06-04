import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [allowCod, setAllowCod] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStoreData() {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Get store data
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', session.user.email)
          .single();

        if (storeData) {
          setStore(storeData);
          setAllowCod(storeData.allow_cod !== false);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        setError('Failed to load store data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStoreData();
  }, [router]);

  const handleSave = async () => {
    if (!store) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const { error: updateError } = await supabase
        .from('stores')
        .update({ allow_cod: allowCod })
        .eq('id', store.id);
      
      if (updateError) throw updateError;
      
      // Show success message
      alert('Payment methods updated successfully');
    } catch (error) {
      console.error('Error updating payment methods:', error);
      setError('Failed to update payment methods');
    } finally {
      setIsSaving(false);
    }
  };

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
        <title>Payment Methods - sellor.ai</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Configure Payment Methods</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose which payment methods your customers can use to pay for orders.
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Credit/Debit Card */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Credit/Debit Card</h3>
                  <p className="text-sm text-gray-500">
                    Accept payments via Stripe
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full cursor-not-allowed">
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-6"></div>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cash on Delivery (COD)</h3>
                  <p className="text-sm text-gray-500">
                    Allow customers to pay when they receive their order
                  </p>
                </div>
                <div 
                  className={`relative inline-block w-12 h-6 ${allowCod ? 'bg-blue-600' : 'bg-gray-200'} rounded-full cursor-pointer`}
                  onClick={() => setAllowCod(!allowCod)}
                >
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform ${allowCod ? 'translate-x-6' : ''} transition-transform`}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}