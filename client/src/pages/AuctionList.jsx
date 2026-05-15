import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auctions');
        setAuctions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch auctions');
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl">Loading auctions...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Live Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={auction.image !== 'no-photo.jpg' ? auction.image : 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={auction.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-lg">${auction.currentBid}</span>
                <span className="text-sm text-gray-500">
                  Ends: {new Date(auction.endTime).toLocaleDateString()}
                </span>
              </div>
              <Link 
                to={`/auctions/${auction._id}`} 
                className="mt-4 block w-full text-center bg-gray-100 text-gray-800 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        {auctions.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No active auctions found. Be the first to create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionList;
