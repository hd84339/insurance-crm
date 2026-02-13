const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: [true, 'Policy reference is required']
  },
  claimNumber: {
    type: String,
    required: [true, 'Claim number is required'],
    unique: true,
    trim: true
  },
  claimType: {
    type: String,
    enum: ['Death', 'Maturity', 'Accident', 'Medical', 'Surrender', 'Partial Withdrawal', 'Other'],
    required: [true, 'Claim type is required']
  },
  claimAmount: {
    type: Number,
    required: [true, 'Claim amount is required'],
    min: [0, 'Claim amount cannot be negative']
  },
  approvedAmount: {
    type: Number,
    min: [0, 'Approved amount cannot be negative']
  },
  claimDate: {
    type: Date,
    required: [true, 'Claim date is required'],
    default: Date.now
  },
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Settled', 'Shortfall'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  description: {
    type: String,
    required: [true, 'Claim description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    }
  }],
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  shortfallReason: {
    type: String,
    maxlength: [500, 'Shortfall reason cannot exceed 500 characters']
  },
  settlementDate: {
    type: Date
  },
  paymentMode: {
    type: String,
    enum: ['Bank Transfer', 'Cheque', 'Cash', 'Online'],
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
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
claimSchema.index({ client: 1, status: 1 });
claimSchema.index({ policy: 1 });
claimSchema.index({ claimNumber: 1 });
claimSchema.index({ status: 1, priority: 1 });
claimSchema.index({ claimDate: -1 });

// Virtual for processing time
claimSchema.virtual('processingDays').get(function() {
  if (this.settlementDate) {
    const diffTime = this.settlementDate - this.claimDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const today = new Date();
  const diffTime = today - this.claimDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update status history
claimSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Claim', claimSchema);
