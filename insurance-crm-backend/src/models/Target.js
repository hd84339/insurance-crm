const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: [true, 'Agent reference is required']
  },
  targetPeriod: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
    required: [true, 'Target period is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  productType: {
    type: String,
    enum: ['Life', 'General', 'Mutual Fund', 'Health', 'Motor', 'All'],
    default: 'All'
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount cannot be negative']
  },
  achievedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Achieved amount cannot be negative']
  },
  targetPolicies: {
    type: Number,
    min: [0, 'Target policies cannot be negative']
  },
  achievedPolicies: {
    type: Number,
    default: 0,
    min: [0, 'Achieved policies cannot be negative']
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Expired', 'Cancelled'],
    default: 'Active'
  },
  achievementPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bonus: {
    threshold: Number, // Achievement percentage for bonus
    amount: Number,
    status: {
      type: String,
      enum: ['Not Applicable', 'Pending', 'Paid'],
      default: 'Not Applicable'
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
targetSchema.index({ agent: 1, targetPeriod: 1, startDate: -1 });
targetSchema.index({ status: 1, endDate: 1 });

// Virtual for shortfall
targetSchema.virtual('shortfall').get(function() {
  return Math.max(0, this.targetAmount - this.achievedAmount);
});

// Virtual for days remaining
targetSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'Active') return 0;
  const today = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// Virtual for is achieved
targetSchema.virtual('isAchieved').get(function() {
  return this.achievedAmount >= this.targetAmount;
});

// Pre-save middleware to calculate achievement percentage
targetSchema.pre('save', function(next) {
  if (this.targetAmount > 0) {
    this.achievementPercentage = Math.min(100, (this.achievedAmount / this.targetAmount) * 100);
  }
  
  // Check if bonus is applicable
  if (this.bonus && this.bonus.threshold && this.achievementPercentage >= this.bonus.threshold) {
    if (this.bonus.status === 'Not Applicable') {
      this.bonus.status = 'Pending';
    }
  }
  
  // Auto-complete if achieved
  if (this.isAchieved && this.status === 'Active') {
    this.status = 'Completed';
  }
  
  // Auto-expire if end date passed
  const today = new Date();
  if (this.endDate < today && this.status === 'Active') {
    this.status = 'Expired';
  }
  
  next();
});

// Static method to get active targets
targetSchema.statics.getActiveTargets = function(agentId) {
  return this.find({
    agent: agentId,
    status: 'Active'
  }).sort({ endDate: 1 });
};

// Static method to update achievement from policy
targetSchema.statics.updateFromPolicy = async function(policy) {
  const today = new Date();
  
  // Find active targets for the agent and period
  const targets = await this.find({
    agent: policy.assignedAgent,
    status: 'Active',
    startDate: { $lte: policy.createdAt },
    endDate: { $gte: policy.createdAt },
    $or: [
      { productType: 'All' },
      { productType: policy.policyType }
    ]
  });
  
  // Update each matching target
  for (const target of targets) {
    target.achievedAmount += policy.premiumAmount;
    target.achievedPolicies += 1;
    await target.save();
  }
};

module.exports = mongoose.model('Target', targetSchema);
