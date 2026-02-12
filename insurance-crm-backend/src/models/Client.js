const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  clientType: {
    type: String,
    enum: ['Individual', 'Corporate'],
    default: 'Individual'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isNewProspect: {
    type: Boolean,
    default: true
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  totalPolicies: {
    type: Number,
    default: 0
  },
  totalInvestments: {
    type: Number,
    default: 0
  },
  totalPremium: {
    type: Number,
    default: 0
  },
  totalMaturity: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Prospect'],
    default: 'Prospect'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for policies
clientSchema.virtual('policies', {
  ref: 'Policy',
  localField: '_id',
  foreignField: 'client'
});

// Indexes for better query performance
clientSchema.index({ name: 'text', email: 'text', phone: 'text' });
clientSchema.index({ assignedAgent: 1, status: 1 });
clientSchema.index({ createdAt: -1 });

// Pre-save middleware to update statistics
clientSchema.pre('save', function(next) {
  if (this.totalPolicies > 0) {
    this.isNewProspect = false;
    this.status = 'Active';
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);
