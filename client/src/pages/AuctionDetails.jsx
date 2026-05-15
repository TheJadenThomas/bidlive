import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [socket, setSocket] = useState(null);
  const [bidHistory, setBidHistory] = useState([]); // Placeholder for actual bid history fetch
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // 1. Fetch Initial Data
    const fetchAuction = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/auctions/${id}`);
        setAuction(data);
        setBidAmount(data.currentBid + 1);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch auction details');
        setLoading(false);
      }
    };
    fetchAuction();

    // 2. Setup Socket.IO
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinAuction', id);

    // 3. Listen for incoming bids
    newSocket.on('bidUpdate', (data) => {
      setAuction((prev) => ({
        ...prev,
        currentBid: data.currentBid,
      }));
      setBidAmount(data.currentBid + 1); // update suggested bid
      
      // Optionally add to local bid history
      setBidHistory(prev => [{ amount: data.currentBid, time: data.timestamp }, ...prev]);
    });

    newSocket.on('bidError', (data) => {
      setBidError(data.message);
      setTimeout(() => setBidError(''), 3000);
    });

    // Cleanup on unmount
    return () => {
      newSocket.emit('leaveAuction', id);
      newSocket.disconnect();
    };
  }, [id]);

  const handleBid = (e) => {
    e.preventDefault();
    if (!user) {
      setBidError('Please log in to place a bid');
      return;
    }
    
    if (socket) {
      socket.emit('placeBid', {
        auctionId: id,
        userId: user._id,
        bidAmount: Number(bidAmount),
      });
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading auction details...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!auction) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {bidError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{bidError}</span>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 relative group">
          <img 
            src={auction.image !== 'no-photo.jpg' ? auction.image : 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={auction.title} 
            className="w-full h-full object-cover min-h-[400px]"
          />
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
            {auction.status.toUpperCase()}
          </div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-between bg-gray-50">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{auction.title}</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{auction.description}</p>
            
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Current Bid</p>
                  <p className="text-5xl font-black text-primary transition-all duration-300 transform scale-100 hover:scale-105">
                    ${auction.currentBid}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Ends In</p>
                  <p className="text-2xl font-bold text-red-500">
                    {new Date(auction.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleBid} className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <label htmlFor="bid" className="sr-only">Bid Amount</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-bold text-xl">$</span>
                      </div>
                      <input
                        type="number"
                        name="bid"
                        id="bid"
                        className="focus:ring-2 focus:ring-primary focus:border-primary block w-full pl-9 pr-12 text-2xl font-semibold border-gray-300 rounded-lg py-4 transition-shadow"
                        placeholder="0.00"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={auction.currentBid + 1}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={auction.status !== 'active'}
                    className={`px-8 py-4 rounded-lg font-bold text-lg text-white shadow-md transition-all transform active:scale-95 ${
                      auction.status === 'active' 
                        ? 'bg-primary hover:bg-blue-600 hover:shadow-lg' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Place Bid
                  </button>
                </div>
                {!user && (
                  <p className="mt-3 text-sm text-red-500 font-medium">Please log in to participate in the auction.</p>
                )}
              </form>
            </div>
          </div>
          
          {/* Real-time Bid Feed Indicator */}
          <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Connection Established
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
