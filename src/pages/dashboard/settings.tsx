import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mock store data
const mockStoreData = {
  name: 'Your Store',
  logo: '',
  primaryColor: '#3B82F6',
  description: 'Welcome to my store! We sell high-quality products.',
  contactEmail: 'contact@example.com',
  customDomain: '',
  stripeConnected: false,
  shippingRate: '5.00',
  freeShippingThreshold: '50.00',
  refundPolicy: 'We accept returns within 30 days of purchase.',
  privacyPolicy: 'We respect your privacy and do not share your information with third parties.',
  termsOfService: 'By using our store, you agree to these terms of service.'
};

export default function StoreSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeData, setStoreData] = useState(mockStoreData);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [domainStatus, setDomainStatus] = useState('not-connected');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    alert('Settings saved successfully!');
  };
  
  const connectStripe = () => {
    // In a real implementation, this would redirect to Stripe Connect OAuth flow
    alert('In production, this would redirect to Stripe Connect OAuth flow.');
    setStoreData(prev => ({
      ...prev,
      stripeConnected: true
    }));
  };
  
  const verifyDomain = () => {
    if (!storeData.customDomain) {
      alert('Please enter a domain first.');
      return;
    }
    
    setDomainStatus('verifying');
    
    // Simulate verification process
    setTimeout(() => {
      setDomainStatus('connected');
    }, 2000);
  };
  
  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Store Settings - sellor.ai</title>
      </Head>
      
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold">sellor.ai</span>
        </div>
        
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          <Link href="/dashboard/products" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
          
          <Link href="/dashboard/orders" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </Link>
          
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-900 bg-gray-100">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-900">Store Settings</h1>
        </header>
        
        {/* Content */}
        <main className="p-6">
          {/* Tabs */}
          <div className="mb-6 border-b">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipping
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Policies
              </button>
            </nav>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">Store Information</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Basic information about your store.
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={storeData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Logo
                    </label>
                    <div className="flex items-center">
                      <div className="w-16 h-16 border rounded-md flex items-center justify-center mr-4 bg-gray-50">
                        {storeData.logo ? (
                          <img src={storeData.logo} alt="Store logo" className="max-h-full max-w-full" />
                        ) : (
                          <span className="text-gray-400 text-xs text-center">No logo</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Upload Logo
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={storeData.primaryColor}
                        onChange={handleChange}
                        className="w-10 h-10 rounded-md border border-gray-300 p-1 mr-2"
                      />
                      <input
                        type="text"
                        value={storeData.primaryColor}
                        onChange={handleChange}
                        name="primaryColor"
                        className="w-28 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={storeData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This will be displayed on your store's About page and used for SEO.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={storeData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Domain
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="customDomain"
                        name="customDomain"
                        value={storeData.customDomain}
                        onChange={handleChange}
                        placeholder="yourdomain.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={verifyDomain}
                        className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Verify
                      </button>
                    </div>
                    <div className="mt-2">
                      {domainStatus === 'not-connected' && (
                        <p className="text-sm text-gray-500">
                          To use your custom domain, add a CNAME record pointing to <code>stores.sellor.ai</code>
                        </p>
                      )}
                      {domainStatus === 'verifying' && (
                        <p className="text-sm text-yellow-600 flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying domain...
                        </p>
                      )}
                      {domainStatus === 'connected' && (
                        <p className="text-sm text-green-600 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Domain connected successfully!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">Payment Settings</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect your payment processor to start accepting payments.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-md font-medium mb-2">Stripe Connect</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your Stripe account to process payments. Funds will be deposited directly to your bank account.
                    </p>
                    
                    {storeData.stripeConnected ? (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-700">Stripe account connected</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={connectStripe}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Connect with Stripe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">Shipping Settings</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure shipping rates for your products.
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="shippingRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Shipping Rate Per Order ($)
                    </label>
                    <input
                      type="number"
                      id="shippingRate"
                      name="shippingRate"
                      value={storeData.shippingRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="enableFreeShipping"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableFreeShipping" className="ml-2 block text-sm font-medium text-gray-700">
                        Offer Free Shipping over a certain amount
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">$</span>
                      <input
                        type="number"
                        id="freeShippingThreshold"
                        name="freeShippingThreshold"
                        value={storeData.freeShippingThreshold}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Policies */}
            {activeTab === 'policies' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">Store Policies</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Set up your store's policies to build trust with customers.
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="refundPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                      Refund Policy
                    </label>
                    <textarea
                      id="refundPolicy"
                      name="refundPolicy"
                      value={storeData.refundPolicy}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                      Privacy Policy
                    </label>
                    <textarea
                      id="privacyPolicy"
                      name="privacyPolicy"
                      value={storeData.privacyPolicy}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="termsOfService" className="block text-sm font-medium text-gray-700 mb-1">
                      Terms of Service
                    </label>
                    <textarea
                      id="termsOfService"
                      name="termsOfService"
                      value={storeData.termsOfService}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}