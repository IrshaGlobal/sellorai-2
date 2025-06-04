import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mock store data
const mockStore = {
  name: 'Demo Store',
  description: 'Welcome to our store! We sell high-quality products.',
  primaryColor: '#3B82F6'
};

// Mock order data
const mockOrder = {
  id: 'ORD-1234',
  date: new Date().toLocaleDateString(),
  items: [
    { id: 1, title: 'Premium Leather Crossbody Bag', price: 79.99, quantity: 1 },
    { id: 2, title: 'Minimalist Ceramic Mug', price: 24.99, quantity: 2 }
  ],
  subtotal: 129.97,
  shipping: 5.00,
  total: 134.97,
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'United States'
  }
};

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { storeName } = router.query;
  const [store] = useState(mockStore);
  const [order] = useState(mockOrder);

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Order Confirmation | {store.name}</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/store/${storeName}`} className="text-2xl font-bold">{store.name}</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Order Confirmed!</h1>
            <p className="text-center text-gray-600 mt-2">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Number</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{order.date}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Items</h2>
              <ul className="border rounded-md divide-y">
                {order.items.map(item => (
                  <li key={item.id} className="p-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Shipping Address</h2>
              <div className="border rounded-md p-3">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Order Summary</h2>
              <div className="border rounded-md p-3">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t my-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We'll send you a shipping confirmation email when your order ships.
              </p>
              <Link 
                href={`/store/${storeName}`}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} {store.name}</p>
          <p className="text-sm text-gray-500 mt-2">Powered by <Link href="/" className="text-blue-600">sellor.ai</Link></p>
        </div>
      </footer>
    </div>
  );
}