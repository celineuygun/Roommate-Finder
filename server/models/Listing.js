import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  amenities: [{
    type: String
  }],
  roomType: {
    type: String,
    required: true,
    enum: ['private', 'shared']
  },
  availableFrom: {
    type: Date,
    required: true
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
    },
    gender: {
      type: String,
      enum: ['any', 'male', 'female'],
      default: 'any'
    },
    ageRange: {
      type: [Number],
      default: [18, 99],
      validate: {
        validator: function(arr) {
          return arr.length === 2 && arr[0] <= arr[1] && arr[0] >= 18 && arr[1] <= 99;
        },
        message: 'Invalid age range'
      }
    },
    occupation: {
      type: String,
      enum: ['any', 'student', 'professional'],
      default: 'any'
    }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Listing', listingSchema);