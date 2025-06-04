import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>sellor.ai | AI-Powered E-commerce Platform</title>
        <meta name="description" content="Create your online store with sellor.ai. Upload product images, and our AI generates descriptions, titles, and tags." />
      </Head>
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="w-full py-4 px-6 flex justify-between items-center border-b">
          <div className="flex items-center">
            <span className="text-2xl font-bold">sellor.ai</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100">Login</Link>
            <Link href="/signup" className="px-4 py-2 rounded bg-blue-600 text-white">Start Free Trial</Link>
          </div>
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-16 px-6 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Launch Your Online Store in Minutes with AI Power</h1>
              <p className="text-xl mb-6">Upload an image, our AI does the rest. Start selling today!</p>
              <Link href="/signup" className="px-6 py-3 rounded-full bg-blue-600 text-white">Create Your Store Now</Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg w-[80%]">
                    <div className="text-center mb-2">AI-Generated Store Preview</div>
                    <div className="border rounded p-4 mb-4 flex items-center justify-center h-32 bg-gray-50">
                      <div className="text-gray-400">Product Image</div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-blue-500 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-12 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-1">Sign Up</h3>
                  <p className="text-sm text-gray-600">Create your account in seconds.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-1">Upload Image</h3>
                  <p className="text-sm text-gray-600">Upload a product photo.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-1">AI Magic</h3>
                  <p className="text-sm text-gray-600">AI creates product details.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-1">Launch</h3>
                  <p className="text-sm text-gray-600">Start selling immediately.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">AI Product Creation</h3>
                  <p className="text-sm text-gray-600">Transform images into complete product listings.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Store Customization</h3>
                  <p className="text-sm text-gray-600">Personalize with your logo and brand colors.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600">Built-in Stripe integration.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Your Own Domain</h3>
                  <p className="text-sm text-gray-600">Free subdomain or custom domain.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-12 px-6 bg-gray-50">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Simple Pricing</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-center">Launch Plan</h3>
                  <div className="flex justify-center items-baseline my-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-center text-gray-500">+ 2% transaction fee</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      AI Product Creation
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Unlimited Products
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Custom Domain Support
                    </li>
                  </ul>
                  <div className="mt-6 text-center">
                    <Link href="/signup" className="px-6 py-2 rounded-full bg-blue-600 text-white inline-block">Get Started</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} sellor.ai</p>
            </div>
            <div className="flex gap-4">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}