import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      gender,
      phone, 
      occupation, 
      bio, 
      preferences 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with default preferences if not provided
    const user = new User({
      email,
      password: hashedPassword,
      name,
      gender,
      phone,
      occupation,
      bio,
      preferences: {
        smoking: preferences?.smoking || false,
        pets: preferences?.pets || false,
        nightLife: preferences?.nightLife || false
      }
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      occupation: user.occupation,
      bio: user.bio,
      preferences: user.preferences
    };

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      occupation: user.occupation,
      bio: user.bio,
      preferences: user.preferences
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;