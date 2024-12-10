import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import auth from '../middleware/auth.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/listings';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Create new listing
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => `/uploads/listings/${file.filename}`);
    
    // Parse preferences from the request body
    const preferences = JSON.parse(req.body.preferences);
    
    const listing = new Listing({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: Number(req.body.price),
      images: imageUrls,
      amenities: JSON.parse(req.body.amenities),
      roomType: req.body.roomType,
      availableFrom: new Date(req.body.availableFrom),
      preferences: {
        smoking: preferences.smoking,
        pets: preferences.pets,
        nightLife: preferences.nightLife,
        gender: preferences.gender,
        ageRange: preferences.ageRange,
        occupation: preferences.occupation
      },
      host: req.user.userId
    });

    await listing.save();

    // Update user's listings
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { listings: listing._id } }
    );

    const populatedListing = await Listing.findById(listing._id)
      .populate('host', 'name avatar occupation preferences');

    res.status(201).json(populatedListing);
  } catch (error) {
    // Clean up uploaded files if listing creation fails
    if (req.files) {
      req.files.forEach(async file => {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
    console.error('Listing creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('host', 'name avatar occupation preferences')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.userId })
      .populate('host', 'name avatar occupation preferences')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get listing by id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name avatar occupation preferences');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update listing
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // Parse existingImages from the request body
    const existingImages = JSON.parse(req.body.existingImages || '[]');

    // Determine which images to delete (images not in existingImages)
    const imagesToDelete = listing.images.filter(image => !existingImages.includes(image));

    // Delete the old images that are not in existingImages
    for (const imageUrl of imagesToDelete) {
      try {
        const imagePath = path.join('uploads/listings', path.basename(imageUrl));
        await fs.unlink(imagePath); // Silme işlemi
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    // Handle new images
    let imageUrls = existingImages; // Mevcut resimleri koruyarak başla
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/listings/${file.filename}`);
      imageUrls = [...imageUrls, ...newImageUrls]; // Yeni resimleri ekle
    }

    // Parse preferences from the request body
    const preferences = JSON.parse(req.body.preferences || '{}');

    // Update the listing in the database
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imageUrls, // Güncellenmiş resim listesini kaydet
        preferences: {
          ...preferences,
          gender: preferences.gender || 'any',
          ageRange: preferences.ageRange || [18, 99],
          occupation: preferences.occupation || 'any',
        },
        amenities: JSON.parse(req.body.amenities || '[]'),
      },
      { new: true }
    ).populate('host', 'name avatar occupation preferences');

    res.json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    // Delete associated images
    for (const imageUrl of listing.images) {
      try {
        const imagePath = path.join('uploads/listings', path.basename(imageUrl));
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    // Remove listing reference from user
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { listings: listing._id } }
    );

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;