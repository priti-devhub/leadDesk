const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address',
      ],
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: {
        values: ['₹5k–10k', '₹10k–25k', '₹25k–50k', '₹50k+'],
        message: 'Invalid budget range selected',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [15, 'Message must be at least 15 characters long'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Closed'],
        message: 'Status must be New, Contacted, or Closed',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast search queries
leadSchema.index({ name: 'text', email: 'text', budget: 'text', message: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
