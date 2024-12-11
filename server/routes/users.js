import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js'
import Message from '../models/Message.js';

const router = express.Router();

// Get user profile with listings
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate({
        path: 'listings',
        populate: {
          path: 'host',
          select: 'name avatar occupation preferences'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: req.body },
      { new: true }
    )
    .select('-password')
    .populate('listings');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/profile', auth, async (req, res) => {
  try {
    // Find the user to delete
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated listings (or any other dependent resources)
    for (const listingId of user.listings) {
      const listing = await Listing.findById(listingId);

      if (listing) {
        // Delete associated images for the listing
        for (const imageUrl of listing.images) {
          try {
            const imagePath = path.join('uploads/listings', path.basename(imageUrl));
            await fs.unlink(imagePath);
          } catch (err) {
            console.error('Error deleting listing image file:', err);
          }
        }
        // Delete the listing
        await listing.deleteOne();
      }
    }

    // // Update all messages where this user is the sender
    // await Message.updateMany(
    //   { sender: userId },
    //   { $set: { sender: null } } // Set sender to null for deleted users
    // );

    // // Update all messages where this user is the receiver
    // await Message.updateMany(
    //   { receiver: userId },
    //   { $set: { receiver: null } } // Set receiver to null for deleted users
    // );

    // Finally, delete the user
    await user.deleteOne();
    res.status(200).json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});






export default router;