import { useState, useEffect, useRef, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type ProductData = {
  title: string;
  description: string;
  price: string;
  sku: string;
  inventory: string;
  tags: string;
  category: string;
  image: File | null;
  imagePreviewUrl: string;
};

export default function NewProduct() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    description: '',
    price: '',
    sku: '',
    inventory: '1',
    tags: '',
    category: '',
    image: null,
    imagePreviewUrl: '',
  });

  useEffect(() => {
    // Get store ID from authenticated user
    async function getStoreId() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: store } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', session.user.email)
          .single();
        
        if (store) {
          setStoreId(store.id);
        }
      } else {
        router.push('/login');
      }
    }
    
    getStoreId();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setProductData({
        ...productData,
        image: file,
        imagePreviewUrl: imageUrl,
      });
      
      // Start AI processing
      setAiProcessing(true);
      
      try {
        // Call OpenAI Vision API to analyze image
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }
        
        const data = await response.json();
        
        // Update form with AI-generated data
        setProductData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          tags: data.tags?.join(', ') || prev.tags,
          category: data.category || prev.category,
        }));
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setAiProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!storeId) {
        throw new Error('Store ID not found');
      }
      
      // Upload image to storage
      let imageUrl = '';
      if (productData.image) {
        const fileName = `${Date.now()}-${productData.image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, productData.image);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }
      
      // Create product in database
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price) || 0,
          sku: productData.sku,
          inventory_quantity: parseInt(productData.inventory) || 1,
          image_url: imageUrl,
          category: productData.category,
          status: 'published',
          tags: productData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
        .select()
        .single();
      
      if (productError) throw productError;
      
      // Redirect to product list
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Add New Product - sellor.ai</title>
      </Head>
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md hidden lg:block">
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold">sellor.ai</span>
        </div>
        
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            Dashboard
          </Link>
          
          <Link href="/dashboard/products" className="flex items-center px-6 py-3 text-gray-900 bg-gray-100">
            Products
          </Link>
          
          <Link href="/dashboard/orders" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            Orders
          </Link>
          
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            Settings
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
        </header>
        
        {/* Content */}
        <main className="p-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} suppressHydrationWarning>
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium mb-4">Product Image</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-blue-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {productData.imagePreviewUrl ? (
                        <img 
                          src={productData.imagePreviewUrl} 
                          alt="Product preview" 
                          className="max-h-full object-contain"
                        />
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">Click to upload product image</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    {aiProcessing ? (
                      <div className="h-64 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">AI is analyzing your product image...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={productData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter product title"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter product description"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                      SKU (Optional)
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={productData.sku}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter SKU"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                      Inventory Quantity
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      value={productData.inventory}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Home & Decor">Home & Decor</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Beauty & Health">Beauty & Health</option>
                      <option value="Toys & Games">Toys & Games</option>
                      <option value="Books">Books</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags/Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={productData.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. summer, cotton, casual"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => router.push('/dashboard/products')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Publishing...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}