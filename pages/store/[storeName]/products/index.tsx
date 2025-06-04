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

// Mock products data
const mockProducts = [
  { id: 1, title: 'Premium Leather Crossbody Bag', price: 79.99, category: 'Accessories' },
  { id: 2, title: 'Minimalist Ceramic Mug', price: 24.99, category: 'Home & Decor' },
  { id: 3, title: 'Wooden Desk Organizer', price: 34.99, category: 'Home & Decor' },
  { id: 4, title: 'Handmade Soap Set', price: 18.99, category: 'Beauty & Health' },
  { id: 5, title: 'Cotton T-Shirt', price: 29.99, category: 'Apparel' },
  { id: 6, title: 'Stainless Steel Water Bottle', price: 22.99, category: 'Accessories' }
];

// Categories
const categories = ['All', 'Accessories', 'Home & Decor', 'Beauty & Health', 'Apparel'];

export default function ProductsPage() {
  const router = useRouter();
  const { storeName } = router.query;
  const [store] = useState(mockStore);
  const [products] = useState(mockProducts);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Default: newest
  });

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Products | {store.name}</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/store/${storeName}`} className="text-2xl font-bold">{store.name}</Link>
          <div className="flex items-center gap-6">
            <Link href={`/store/${storeName}/products`} className="font-medium">Products</Link>
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

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link href={`/store/${storeName}/products/${product.id}`}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/store/${storeName}/products/${product.id}`}>
                  <h3 className="font-medium mb-1">{product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={addToCart}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
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