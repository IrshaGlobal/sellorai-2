import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

// Dynamically import AuthProvider with no SSR to avoid HMR issues
const AuthProviderNoSSR = dynamic(
  () => import('@/lib/context/AuthContext').then((mod) => {
    return { default: mod.AuthProvider };
  }),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProviderNoSSR>
      <Component {...pageProps} />
    </AuthProviderNoSSR>
  );
}