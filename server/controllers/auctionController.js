const Auction = require('../models/Auction');

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({}).populate('createdBy', 'name email');
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('createdBy', 'name email');

    if (auction) {
      res.json(auction);
    } else {
      res.status(404).json({ message: 'Auction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an auction
// @route   POST /api/auctions
// @access  Private
const createAuction = async (req, res) => {
  const { title, description, image, basePrice, endTime } = req.body;

  try {
    const auction = new Auction({
      title,
      description,
      image,
      basePrice,
      endTime,
      createdBy: req.user._id,
    });

    const createdAuction = await auction.save();
    res.status(201).json(createdAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an auction
// @route   PUT /api/auctions/:id
// @access  Private
const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (auction) {
      // Check if user is the creator or an admin
      if (auction.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this auction' });
      }

      auction.title = req.body.title || auction.title;
      auction.description = req.body.description || auction.description;
      auction.image = req.body.image || auction.image;
      auction.basePrice = req.body.basePrice || auction.basePrice;
      auction.endTime = req.body.endTime || auction.endTime;
      auction.status = req.body.status || auction.status;

      const updatedAuction = await auction.save();
      res.json(updatedAuction);
    } else {
      res.status(404).json({ message: 'Auction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an auction
// @route   DELETE /api/auctions/:id
// @access  Private
const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (auction) {
      if (auction.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this auction' });
      }

      await auction.deleteOne();
      res.json({ message: 'Auction removed' });
    } else {
      res.status(404).json({ message: 'Auction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
};
