import { useState, useEffect } from 'react';
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

// Mock products data
const mockProducts = {
  '1': {
    id: 1,
    title: 'Premium Leather Crossbody Bag',
    description: 'Handcrafted genuine leather crossbody bag with adjustable strap and brass hardware. Features multiple compartments for organization and a stylish minimalist design perfect for everyday use.',
    price: 79.99,
    inventory: 12,
    category: 'Accessories'
  },
  '2': {
    id: 2,
    title: 'Minimalist Ceramic Mug',
    description: 'Elegant ceramic mug with a minimalist design, perfect for your morning coffee or tea. Made from high-quality ceramic with a smooth finish and comfortable handle.',
    price: 24.99,
    inventory: 25,
    category: 'Home & Decor'
  },
  '3': {
    id: 3,
    title: 'Wooden Desk Organizer',
    description: 'Beautifully crafted wooden desk organizer to keep your workspace tidy and organized. Features compartments for pens, notes, and small office supplies.',
    price: 34.99,
    inventory: 8,
    category: 'Home & Decor'
  }
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { storeName, productId } = router.query;
  const [store] = useState(mockStore);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId && typeof productId === 'string') {
      // In a real implementation, this would fetch from an API
      setProduct(mockProducts[productId as keyof typeof mockProducts]);
      setIsLoading(false);
    }
  }, [productId]);

  const addToCart = () => {
    setCartCount(prev => prev + quantity);
    alert(`Added ${quantity} item(s) to cart`);
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>{product.title} | {store.name}</title>
        <meta name="description" content={product.description} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/store/${storeName}`} className="text-2xl font-bold">{store.name}</Link>
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

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex text-sm">
          <Link href={`/store/${storeName}`} className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/store/${storeName}/products`} className="text-gray-500 hover:text-gray-700">Products</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-80 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>
              <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
              
              <div className="mb-6">
                <h2 className="font-medium mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border rounded-l-md">
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="px-3 py-1 border rounded-r-md">
                    +
                  </button>
                  <span className="ml-3 text-sm text-gray-500">{product.inventory} available</span>
                </div>
              </div>
              
              <button 
                onClick={addToCart}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add to Cart
              </button>
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