import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Initial mock data
const initialData = {
  totalSales: 0,
  totalOrders: 0,
  storeName: 'Your Store',
  storeUrl: 'your-store.sellor.ai'
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // In a real implementation, this would fetch from an API
        // For MVP, we'll use mock data after a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setDashboardData({
          totalSales: 334.94,
          totalOrders: 3,
          storeName: 'Your Store',
          storeUrl: 'your-store.sellor.ai'
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
      <Head>
        <title>Dashboard - sellor.ai</title>
      </Head>
      
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold">sellor.ai</span>
        </div>
        
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-900 bg-gray-100">
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
          
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
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
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </header>
        
        {/* Content */}
        <main className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Welcome message */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Welcome to your store dashboard!</h2>
                <p className="text-gray-600 mb-4">
                  This is your command center for managing your online store. Start by adding products, customizing your store, and tracking orders.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard/products/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add New Product
                  </Link>
                  <a href={`https://${dashboardData.storeUrl}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    View Your Store
                  </a>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Sales</h3>
                  <p className="text-3xl font-bold">${dashboardData.totalSales.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-2">Lifetime sales</p>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
                  <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
                  <p className="text-sm text-gray-500 mt-2">Lifetime orders</p>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/dashboard/products/new" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center">
                    <svg className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="font-medium">Add Product</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload an image and let AI do the rest</p>
                  </Link>
                  
                  <Link href="/dashboard/settings" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center">
                    <svg className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h3 className="font-medium">Customize Store</h3>
                    <p className="text-sm text-gray-500 mt-1">Update logo, colors, and settings</p>
                  </Link>
                  
                  <Link href="/dashboard/settings" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center">
                    <svg className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="font-medium">Connect Stripe</h3>
                    <p className="text-sm text-gray-500 mt-1">Set up payments for your store</p>
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}