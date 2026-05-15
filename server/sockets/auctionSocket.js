const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific auction room
    socket.on('joinAuction', (auctionId) => {
      socket.join(auctionId);
      console.log(`User ${socket.id} joined auction ${auctionId}`);
    });

    // Handle new bid
    socket.on('placeBid', async (data) => {
      const { auctionId, userId, bidAmount } = data;

      try {
        const auction = await Auction.findById(auctionId);
        
        if (!auction) {
          socket.emit('bidError', { message: 'Auction not found' });
          return;
        }

        if (auction.status !== 'active') {
          socket.emit('bidError', { message: 'Auction is no longer active' });
          return;
        }

        if (bidAmount <= auction.currentBid) {
          socket.emit('bidError', { message: 'Bid must be higher than current bid' });
          return;
        }

        // Create bid record
        const bid = new Bid({
          auctionId,
          userId,
          bidAmount,
        });
        await bid.save();

        // Update auction current bid
        auction.currentBid = bidAmount;
        await auction.save();

        // Broadcast the new bid to everyone in the room (including sender)
        io.to(auctionId).emit('bidUpdate', {
          auctionId,
          currentBid: bidAmount,
          lastBidder: userId,
          timestamp: bid.timestamp,
        });

      } catch (error) {
        console.error(error);
        socket.emit('bidError', { message: 'Failed to place bid' });
      }
    });

    socket.on('leaveAuction', (auctionId) => {
      socket.leave(auctionId);
      console.log(`User ${socket.id} left auction ${auctionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
