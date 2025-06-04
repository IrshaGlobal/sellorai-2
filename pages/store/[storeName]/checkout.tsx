import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load Stripe outside of component render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const router = useRouter();
  const { storeName } = router.query;
  const [store, setStore] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = store?.shipping_rate || 5.00;
  const total = subtotal + shippingCost;

  useEffect(() => {
    async function fetchStoreAndCart() {
      if (!storeName) return;
      
      try {
        // Fetch store data
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('subdomain', storeName)
          .single();
        
        if (storeData) {
          setStore(storeData);
          
          // Get cart from localStorage
          const cartData = localStorage.getItem(`cart_${storeData.id}`);
          if (cartData) {
            setCartItems(JSON.parse(cartData));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStoreAndCart();
  }, [storeName]);

  useEffect(() => {
    async function createPaymentIntent() {
      if (!store || cartItems.length === 0 || paymentMethod !== 'card') return;
      
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            storeId: store.id,
            items: cartItems,
            customer: {
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: formData.country
              }
            }
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    }
    
    // Only create payment intent when form is complete and payment method is card
    if (formData.email && formData.firstName && formData.lastName && formData.address && paymentMethod === 'card') {
      createPaymentIntent();
    }
  }, [formData, store, cartItems, total, paymentMethod]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    await createOrder('paid');
  };

  const handleCodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder('pending');
  };

  const createOrder = async (paymentStatus: string) => {
    try {
      // Create order in database
      const { data: order } = await supabase
        .from('orders')
        .insert({
          store_id: store.id,
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          shipping_address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          },
          subtotal: subtotal,
          shipping_cost: shippingCost,
          total: total,
          payment_status: paymentStatus,
          order_status: 'pending',
          payment_method: paymentMethod
        })
        .select()
        .single();
      
      if (order) {
        // Create order items
        const orderItems = cartItems.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }));
        
        await supabase.from('order_items').insert(orderItems);
        
        // Clear cart
        localStorage.removeItem(`cart_${store.id}`);
        
        // Redirect to confirmation page
        router.push(`/store/${storeName}/order-confirmation?orderId=${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
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
        <title>Checkout | {store?.name}</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/store/${storeName}`} className="text-2xl font-bold">{store?.name}</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="md:flex md:gap-6">
          {/* Checkout Form */}
          <div className="md:w-2/3">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Contact Information</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Shipping Address</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Payment Method</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="card"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit / Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && clientSecret && (
                  <div className="mt-6">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutForm amount={total} onSuccess={handlePaymentSuccess} />
                    </Elements>
                  </div>
                )}

                {/* COD Payment Form */}
                {paymentMethod === 'cod' && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      You'll pay in cash when your order is delivered.
                    </p>
                    <button
                      onClick={handleCodSubmit}
                      className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Place Order (Cash on Delivery)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Order Summary</h2>
              </div>
              <div className="p-4">
                <ul className="mb-4">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex justify-between mb-2">
                      <span>{item.title} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t my-4"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} {store?.name}</p>
          <p className="text-sm text-gray-500 mt-2">Powered by <Link href="/" className="text-blue-600">sellor.ai</Link></p>
        </div>
      </footer>
    </div>
  );
}