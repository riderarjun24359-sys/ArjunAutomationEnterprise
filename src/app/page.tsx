import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Arjun Automations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Enterprise-grade automation solutions engineered for high-performance businesses.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:shadow-xl dark:bg-indigo-700 dark:hover:bg-indigo-800">
              Start Free Trial
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition duration-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
              View Feature Demo
            </button>
          </div>
        </section>

        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Why Enterprises Choose Arjun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2..." width="20" height="20" fill="none">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12l18 9"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    API-First Architecture
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Our platform integrates with 50+ enterprise systems through clean, secure APIs.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Real-Time Monitoring
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  See system health with granular visibility at every level of your infrastructure.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Global Enterprises
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-500">
                    280+ Clients
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Organizations across 15 countries
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-500">
                    99.95% Uptime
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Enterprise-grade reliability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to automate your business?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:shadow-xl dark:bg-indigo-700 dark:hover:bg-indigo-800">
              Start Free Trial
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition duration-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
              View Feature Demo
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}