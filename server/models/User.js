import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be either male, female, or other'
    }
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]+$/, 'Please provide a valid phone number']
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
    trim: true,
    minlength: [2, 'Occupation must be at least 2 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  preferences: {
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    },
    nightLife: {
      type: Boolean,
      default: false
    }
  },
  avatar: {
    type: String,
    default: null
  },
  listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for email to improve query performance
userSchema.index({ email: 1 });

// Pre-save middleware to ensure required fields
userSchema.pre('save', function(next) {
  if (!this.preferences) {
    this.preferences = {
      smoking: false,
      pets: false,
      nightLife: false
    };
  }
  next();
});

export default mongoose.model('User', userSchema);