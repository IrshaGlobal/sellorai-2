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

// Mock cart items
const initialCartItems = [
  { id: 1, title: 'Premium Leather Crossbody Bag', price: 79.99, quantity: 1 },
  { id: 2, title: 'Minimalist Ceramic Mug', price: 24.99, quantity: 2 }
];

export default function CartPage() {
  const router = useRouter();
  const { storeName } = router.query;
  const [store] = useState(mockStore);
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 5.00;
  const total = subtotal + shippingCost;

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Shopping Cart | {store.name}</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/store/${storeName}`} className="text-2xl font-bold">{store.name}</Link>
          <div className="flex items-center gap-6">
            <Link href={`/store/${storeName}/products`}>Products</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="md:flex md:gap-6">
            {/* Cart Items */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <ul>
                  {cartItems.map(item => (
                    <li key={item.id} className="border-b last:border-b-0 p-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mr-4">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border rounded-l-md">
                            -
                          </button>
                          <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border rounded-r-md">
                            +
                          </button>
                        </div>
                        <div className="ml-6 text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Order Summary</h2>
                </div>
                <div className="p-4">
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
                  <Link 
                    href={`/store/${storeName}/checkout`}
                    className="block w-full text-center py-2 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link 
              href={`/store/${storeName}/products`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        )}
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