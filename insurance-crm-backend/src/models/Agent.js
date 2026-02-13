const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Agent'],
    default: 'Agent'
  },
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  totalClients: {
    type: Number,
    default: 0
  },
  totalPolicies: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
agentSchema.index({ email: 1 });

// Hash password before saving
agentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
agentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Agent', agentSchema);
