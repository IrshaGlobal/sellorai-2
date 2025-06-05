import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

// Create a context for auth state
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  store: any;
  loading: boolean;
}>({
  isAuthenticated: false,
  user: null,
  store: null,
  loading: true,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            try {
              // Get user data from our API
              const response = await fetch('/api/auth/me');
              if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setUserData(data.user);
                
                // Get store data if available
                if (data.user?.storeId) {
                  const { data: store } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('id', data.user.storeId)
                    .single();
                    
                  setStoreData(store);
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserData(null);
          setStoreData(null);
          
          // Redirect to login if not on a public page
          const publicPages = ['/login', '/signup', '/'];
          if (!publicPages.includes(router.pathname)) {
            router.push(redirectTo);
          }
        }
        
        setIsLoading(false);
      }
    );

    // Initial auth check
    async function checkAuth() {
      try {
        // Check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user data from our API
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUserData(data.user);
            
            // Get store data if available
            if (data.user?.storeId) {
              const { data: store } = await supabase
                .from('stores')
                .select('*')
                .eq('id', data.user.storeId)
                .single();
                
              setStoreData(store);
            }
          } else {
            // If API call fails but we have a session, try to refresh
            await supabase.auth.refreshSession();
          }
        } else {
          // No session, check if we need to redirect
          const publicPages = ['/login', '/signup', '/'];
          if (!publicPages.includes(router.pathname)) {
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      // Clean up the subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Provide auth context to children
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user: userData, 
        store: storeData,
        loading: isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}