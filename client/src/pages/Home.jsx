import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Placeholder */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">BidLive</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
          <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-dark mb-6">
            Real-Time Auctions, <span className="text-primary">Anywhere.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience the thrill of live bidding with BidLive. Join now to find amazing deals or auction your own items to the highest bidder in real-time.
          </p>
          <div className="space-x-4">
            <Link to="/auctions" className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-600 transition-colors">
              Explore Auctions
            </Link>
            <Link to="/register" className="bg-white text-primary border border-primary px-8 py-3 rounded-md text-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <footer className="bg-dark text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} BidLive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
