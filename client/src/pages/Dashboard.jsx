import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../config/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myAuctions, setMyAuctions] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyAuctions = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/auctions`);
        // Filter auctions created by the logged-in user
        const userAuctions = data.filter(auction => auction.createdBy._id === user._id);
        setMyAuctions(userAuctions);
      } catch (error) {
        console.error("Error fetching user's auctions", error);
      }
    };

    fetchMyAuctions();

    const socket = io(SOCKET_URL);
    socket.on('globalBidUpdate', (data) => {
      setMyAuctions((prevAuctions) => 
        prevAuctions.map((auction) => 
          auction._id === data.auctionId 
            ? { ...auction, currentBid: data.currentBid } 
            : auction
        )
      );
    });

    return () => socket.disconnect();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <p className="text-gray-500">{user.email} | Role: {user.role}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <Link 
          to="/create-auction" 
          className="bg-secondary text-white px-6 py-3 rounded-md font-bold shadow hover:bg-green-600 transition-colors"
        >
          + Create New Auction
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Created Auctions</h2>
      {myAuctions.length === 0 ? (
        <p className="text-gray-500">You haven't created any auctions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAuctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-bold truncate">{auction.title}</h3>
              <p className="text-gray-600 mb-2">Current Bid: ${auction.currentBid}</p>
              <div className="flex justify-between items-center mt-4">
                <span className={`px-2 py-1 text-xs rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {auction.status}
                </span>
                <Link to={`/auctions/${auction._id}`} className="text-primary hover:underline text-sm">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
