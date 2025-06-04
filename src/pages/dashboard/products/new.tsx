import { useState, useRef, FormEvent } from 'react';
import Head from 'next/head';
import { Geist } from 'next/font/google';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
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
        // In a real implementation, we would upload the image to a storage service
        // and get a URL to pass to the AI service
        // For MVP, we'll simulate this with a mock API call
        
        // Mock API call - in production this would be a real API call
        const response = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: 'mock-image-url' }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }
        
        const data = await response.json();
        
        // Update form with AI-generated data
        setProductData(prev => ({
          ...prev,
          title: data.title,
          description: data.description,
          tags: data.tags.join(', '),
          category: data.category,
        }));
      } catch (error) {
        console.error('Error analyzing image:', error);
        // Handle error - show message to user
      } finally {
        setAiProcessing(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real implementation, this would submit the form data to an API
      // For MVP, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to products page or show success message
      alert('Product created successfully!');
      // In production: router.push('/dashboard/products');
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error - show message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Add New Product - sellor.ai</title>
      </Head>
      
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium mb-4">Product Image</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-blue-500 transition-colors"
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
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. summer, cotton, casual"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}