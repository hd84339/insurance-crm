const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  policyNumber: {
    type: String,
    required: [true, 'Policy number is required'],
    unique: true,
    trim: true
  },
  policyType: {
    type: String,
    enum: ['Life Insurance', 'General Insurance', 'Mutual Fund', 'Health', 'Motor', 'Travel'],
    required: [true, 'Policy type is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    enum: ['LIC', 'Bajaj', 'HDFC', 'ICICI', 'TATA AIA', 'SBI Life', 'Max Life', 'Other']
  },
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  premiumAmount: {
    type: Number,
    required: [true, 'Premium amount is required'],
    min: [0, 'Premium cannot be negative']
  },
  premiumFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'],
    default: 'Yearly'
  },
  sumAssured: {
    type: Number,
    required: [true, 'Sum assured is required'],
    min: [0, 'Sum assured cannot be negative']
  },
  policyTerm: {
    type: Number, // in years
    required: [true, 'Policy term is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  maturityDate: {
    type: Date,
    required: [true, 'Maturity date is required']
  },
  renewalDate: {
    type: Date
  },
  nextPremiumDue: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Lapsed', 'Matured', 'Surrendered', 'Pending'],
    default: 'Active'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  nominees: [{
    name: String,
    relationship: String,
    dateOfBirth: Date,
    share: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  commission: {
    percentage: Number,
    amount: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
policySchema.index({ client: 1, status: 1 });
policySchema.index({ renewalDate: 1, status: 1 });
policySchema.index({ nextPremiumDue: 1, paymentStatus: 1 });
policySchema.index({ policyType: 1, company: 1 });

// Virtual for days until renewal
policySchema.virtual('daysUntilRenewal').get(function () {
  if (!this.renewalDate) return null;
  const today = new Date();
  const renewal = new Date(this.renewalDate);
  const diffTime = renewal - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to update client statistics
policySchema.post('save', async function () {
  const Client = mongoose.model('Client');
  const policies = await mongoose.model('Policy').find({ client: this.client });

  const stats = {
    totalPolicies: policies.length,
    totalPremium: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
    totalMaturity: policies.reduce((sum, p) => sum + p.sumAssured, 0)
  };

  await Client.findByIdAndUpdate(this.client, stats);
});

// Pre-remove middleware to update client statistics
policySchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Client = mongoose.model('Client');
    const policies = await mongoose.model('Policy').find({ client: doc.client });

    const stats = {
      totalPolicies: policies.length,
      totalPremium: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
      totalMaturity: policies.reduce((sum, p) => sum + p.sumAssured, 0)
    };

    await Client.findByIdAndUpdate(doc.client, stats);
  }
});

module.exports = mongoose.model('Policy', policySchema);
