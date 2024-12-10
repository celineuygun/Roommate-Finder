import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import transporter from '../scripts/mailer.js';

const router = express.Router();

export async function sendVerificationEmail(to, token) {
  const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"RoommateFinder" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center;">
          <h1 style="color: #0056b3;">RoommateFinder</h1>
          <p style="font-size: 16px; color: #555;">Find your perfect roommate effortlessly!</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333;">
          Hi there,
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with <strong>RoommateFinder</strong>. Please verify your email address to activate your account.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" 
             style="background-color: #0056b3; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; display: inline-block; font-size: 16px;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If the button above doesn't work, you can also verify your email by clicking the link below:
        </p>
        <p style="font-size: 14px; color: #555; word-wrap: break-word;">
          <a href="${verificationLink}" style="color: #0056b3;">${verificationLink}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you didn't register for RoommateFinder, you can safely ignore this email.
        </p>
      </div>
    `,
  };
  

  try {
      await transporter.sendMail(mailOptions); // Use the imported transporter
      console.log('Verification email sent to:', to);
  } catch (error) {
      console.error('Email sending error:', error);
      throw error;
  }
}


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
    console.log('Received signup request:', { email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString('hex');

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
      },
      verificationToken: token,
      tokenExpiration: Date.now() + 3600000, // 1 hour
    });

    await user.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Signup successful. Verification email sent.' });
    } catch (err) {
      res.status(500).json({ message: 'Error signing up', error: err.message });
    }
});

router.get('/verify-email', async (req, res) => {
  try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).send('Verification token is missing');
      }

      // Check if the user exists and is unverified
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
        const alreadyVerifiedUser = await User.findOne({ isVerified: true });
        if (alreadyVerifiedUser) {
          return res.status(200).json({ message: 'Email is successfully verified.' });
        }

        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Check if the user is already verified
      if (user.isVerified) {
        return res.status(200).json({ message: 'Email is successfully verified.' });
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.tokenExpiration = null;
      await user.save();

      console.log('User verified:', user.email);
      res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error verifying email', error: err.message });
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

    // Verify email
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
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