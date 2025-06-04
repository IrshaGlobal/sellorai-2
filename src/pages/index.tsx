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
        <title>sellor.ai | AI-Powered E-commerce Platform for Small Businesses</title>
        <meta name="description" content="Create your online store effortlessly with sellor.ai. Upload product images, and our AI generates descriptions, titles, and tags. Start selling online today!" />
        <meta name="keywords" content="AI e-commerce, AI product description generator, easy online store, multi-vendor platform" />
      </Head>
      <div
        className={`${geistSans.className} ${geistMono.className} min-h-screen flex flex-col`}
      >
        {/* Header */}
        <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center border-b">
          <div className="flex items-center">
            <span className="text-2xl font-bold">sellor.ai</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Start Free Trial
            </Link>
          </div>
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-20 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Launch Your Online Store in Minutes with AI Power</h1>
              <p className="text-xl mb-8">Upload an image, our AI does the rest. Start selling today!</p>
              <Link href="/signup" className="px-8 py-4 rounded-full bg-blue-600 text-white text-lg hover:bg-blue-700 transition-colors">
                Create Your Store Now
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[80%]">
                    <div className="text-center mb-4">AI-Generated Store Preview</div>
                    <div className="border rounded p-4 mb-4 flex items-center justify-center h-40 bg-gray-50">
                      <div className="text-gray-400">Product Image</div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-8 bg-blue-500 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-16 px-6 md:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                  <p className="text-gray-600">Create your account in seconds and get your own store address.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Product Image</h3>
                  <p className="text-gray-600">Simply upload a photo of your product.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Generates Product Details</h3>
                  <p className="text-gray-600">Our AI creates titles, descriptions, and tags automatically.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customize & Launch</h3>
                  <p className="text-gray-600">Make any adjustments and start selling immediately.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">AI Product Creation</h3>
                  <p className="text-gray-600">Transform a single image into a complete product listing with AI-generated details.</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Simple Store Customization</h3>
                  <p className="text-gray-600">Personalize your store with your logo and brand colors in minutes.</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
                  <p className="text-gray-600">Accept payments safely with built-in Stripe integration.</p>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Your Own Store Address</h3>
                  <p className="text-gray-600">Get a free subdomain or connect your custom domain.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-16 px-6 md:px-12 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8 border-b">
                  <h3 className="text-2xl font-bold text-center">Launch Plan</h3>
                  <div className="flex justify-center items-baseline my-8">
                    <span className="text-5xl font-extrabold">$29</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-center text-gray-500 mb-8">+ 2% transaction fee</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      AI Product Creation
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Unlimited Products
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      1 Staff Account
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Standard Theme
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Subdomain Included
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Custom Domain Support
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Secure Checkout
                    </li>
                  </ul>
                  <div className="mt-8 text-center">
                    <Link href="/signup" className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-block">
                      Get Started with Launch Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-16 px-6 md:px-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">How does AI product creation work?</h3>
                  <p className="text-gray-600">Simply upload a product image, and our AI analyzes it to generate a title, description, and relevant tags. You can review and edit these details before publishing.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Can I use my own domain?</h3>
                  <p className="text-gray-600">Yes! You'll get a free subdomain (yourstore.sellor.ai), but you can also connect your own custom domain at no extra cost.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">What are the fees?</h3>
                  <p className="text-gray-600">Our Launch Plan is $29/month plus a 2% transaction fee on sales. There are no hidden costs or setup fees.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">How do I get paid?</h3>
                  <p className="text-gray-600">Payments go directly to your connected Stripe account. You'll need to set up Stripe during the store creation process.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 md:px-12 border-t">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} sellor.ai. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}