import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js'
import Message from '../models/Message.js';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const API_BASE_URL = process.env.VITE_API_URL;
// Avatar yükleme için multer ayarları
// Burada diskStorage kullanarak dosyayı 'uploads/avatars' klasörüne kaydediyoruz.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Benzersiz isim için zaman damgası + orijinal isim
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

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
        },
      })
      .populate({
        path: 'savedListings',
        populate: {
          path: 'host',
          select: 'name avatar occupation preferences',
        },
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

// Yeni Avatar Yükleme Endpoint'i
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Kaydedilen dosyanın yolunu elde edelim
    const avatarUrl = `${API_BASE_URL}/public/avatars/${req.file.filename}`;

    // Kullanıcının avatar alanını güncelle
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Avatar updated successfully', avatar: user.avatar });
  } catch (error) {
    console.error('Error uploading avatar:', error);
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
            const imagePath = path.join('public/listings', path.basename(imageUrl));
            await fs.unlink(imagePath);
          } catch (err) {
            if (err.code === 'ENOENT') {
              console.warn(`File not found: ${err.path}`);
            } else {
              console.error('Error deleting listing image file:', err);
            }
          }
        }
        // Delete the listing
        await listing.deleteOne();
      }
    }

    // Delete messages where the user is either the sender or receiver
    await Message.deleteMany({
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    // Finally, delete the user
    await user.deleteOne();
    res.status(200).json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});






export default router;