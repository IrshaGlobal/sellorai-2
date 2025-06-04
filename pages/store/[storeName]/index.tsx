import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function StorePage() {
  const router = useRouter();
  const { storeName } = router.query;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreData() {
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
          
          // Fetch products for this store
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeData.id)
            .eq('status', 'published')
            .limit(8);
          
          if (productsData) {
            setProducts(productsData);
          }
          
          // Get cart count from localStorage
          const cartData = localStorage.getItem(`cart_${storeData.id}`);
          if (cartData) {
            const cart = JSON.parse(cartData);
            setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStoreData();
  }, [storeName]);

  const addToCart = (product: any) => {
    if (!store) return;
    
    // Get current cart
    const cartData = localStorage.getItem(`cart_${store.id}`);
    let cart = cartData ? JSON.parse(cartData) : [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1
      });
    }
    
    // Save cart
    localStorage.setItem(`cart_${store.id}`, JSON.stringify(cart));
    
    // Update cart count
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store not found</h1>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>{store.name}</title>
        <meta name="description" content={store.description} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <div className="flex items-center gap-6">
            <Link href={`/store/${storeName}/products`}>Products</Link>
            <Link href={`/store/${storeName}/cart`} className="relative">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to {store.name}</h2>
          <p className="text-lg text-gray-600 mb-8">{store.description}</p>
          <Link href={`/store/${storeName}/products`} 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            style={{ backgroundColor: store.primary_color }}>
            Browse Products
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                <Link href={`/store/${storeName}/products/${product.id}`}>
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-500">Product Image</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/store/${storeName}/products/${product.id}`}>
                    <h3 className="font-medium mb-2">{product.title}</h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${parseFloat(product.price).toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 text-white rounded-md hover:opacity-90"
                      style={{ backgroundColor: store.primary_color }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} {store.name}</p>
          <p className="text-sm text-gray-500 mt-2">Powered by <Link href="/" className="text-blue-600">sellor.ai</Link></p>
        </div>
      </footer>
    </div>
  );
}