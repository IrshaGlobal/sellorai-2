import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import AuthGuard from '@/components/AuthGuard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
    
    fetchUser();
  }, []);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <AuthGuard>
      <div className={`${geistSans.className} min-h-screen bg-gray-50`}>
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
          
          <div className="p-4 border-b">
            <div className="text-sm font-medium text-gray-900">{user?.storeName || 'Your Store'}</div>
            <div className="text-sm text-gray-500">{user?.email || ''}</div>
          </div>
          
          <nav className="mt-6">
            <Link href="/dashboard" className={`flex items-center px-6 py-3 ${
              router.pathname === '/dashboard' ? 'text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <Link href="/dashboard/products" className={`flex items-center px-6 py-3 ${
              router.pathname.startsWith('/dashboard/products') ? 'text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </Link>
            
            <Link href="/dashboard/orders" className={`flex items-center px-6 py-3 ${
              router.pathname.startsWith('/dashboard/orders') ? 'text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </Link>
            
            <Link href="/dashboard/settings" className={`flex items-center px-6 py-3 ${
              router.pathname.startsWith('/dashboard/settings') ? 'text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-50'
            }`}>
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>
        </aside>
        
        {/* Main content */}
        <div className="lg:pl-64">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}