import { useState, useEffect } from 'react';
// 1. IMPORT THE LOGO (Adjust the path if 'assets' is not directly one level up)
import logo from '../assets/logo.png'; 

function App() {
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Start zoom/fade animation at 2 seconds
    const animateTimer = setTimeout(() => {
      setAnimateOut(true);
    }, 2000);

    // Hide loading screen completely at 3 seconds
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div
            className={`transition-all duration-1000 ease-in-out ${
              animateOut
                ? 'scale-[3] opacity-0'
                : 'scale-100 opacity-100'
            }`}
          >
            <img
              // 2. USE THE IMPORTED LOGO VARIABLE HERE
              src={logo}
              alt="Snippix Logo"
              // 3. SET A SMALLER, PASSPORT-SIZE APPROXIMATION
              className="w-48 h-48 object-contain" 
            />
          </div>

          {/* Text */}
          <h1
            className={`text-white text-4xl font-bold tracking-wider transition-opacity duration-700 ${
              animateOut ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            SNIPPIX
          </h1>
        </div>
      </div>
    );
  }

  // Homepage
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Temporary Homepage Placeholder */}
      <div className="container mx-auto px-4 py-8">
        <header className="border-b pb-4 mb-8">
          <h2 className="text-3xl font-bold">Snippix</h2>
          <p className="text-gray-600 mt-2">Your Social Platform</p>
        </header>
        
        <div className="grid gap-4">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Welcome to Snippix</h3>
            <p className="text-gray-700">Homepage content will go here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;