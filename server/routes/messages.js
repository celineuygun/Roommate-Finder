import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

const router = express.Router();

// Get all chat threads for the current user
router.get('/threads', auth, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(req.user.userId) },
            { receiver: new mongoose.Types.ObjectId(req.user.userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            listing: '$listing',
            otherUser: {
              $cond: {
                if: { $eq: ['$sender', new mongoose.Types.ObjectId(req.user.userId)] },
                then: '$receiver',
                else: '$sender'
              }
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(req.user.userId)] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const threads = await Promise.all(
      messages.map(async (thread) => {
        const [listing, otherUser] = await Promise.all([
          Listing.findById(thread._id.listing)
            .select('title images location price'),
          User.findById(thread._id.otherUser)
            .select('name avatar occupation')
        ]);

        return {
          listing,
          otherUser,
          lastMessage: thread.lastMessage,
          unreadCount: thread.unreadCount
        };
      })
    );

    res.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ message: 'Error fetching threads' });
  }
});

// Get chat history for a specific listing and user
router.get('/:listingId/:userId', auth, async (req, res) => {
  try {
    const { listingId, userId } = req.params;
    
    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(listingId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid listing or user ID format' });
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user.userId, receiver: userId },
        { sender: userId, receiver: req.user.userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Get all inquiries for a listing (for listing owner)
router.get('/listing/:listingId/inquiries', auth, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    // Verify listing exists and user is the owner
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view these inquiries' });
    }

    const listingObjectId = new mongoose.Types.ObjectId(listingId);
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    // Find all unique senders who have sent messages about this listing
    const uniqueSenders = await Message.aggregate([
      {
        $match: {
          listing: listingObjectId,
          receiver: userObjectId
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$sender',
          lastMessageId: { $first: '$_id' },
          lastMessageDate: { $first: '$createdAt' }
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ]);

    if (uniqueSenders.length === 0) {
      return res.json([]);
    }

    // Fetch the complete messages with populated user information
    const messages = await Message.find({
      _id: { 
        $in: uniqueSenders.map(item => item.lastMessageId)
      }
    })
    .populate('sender', 'name avatar occupation')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

// Mark messages as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    const { senderId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'Invalid sender ID format' });
    }

    const result = await Message.updateMany(
      {
        sender: senderId,
        receiver: req.user.userId,
        read: false
      },
      { read: true }
    );

    res.json({ 
      message: 'Messages marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
});

export default router;