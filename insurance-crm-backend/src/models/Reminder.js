const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy'
  },
  reminderType: {
    type: String,
    enum: ['Renewal', 'Premium Due', 'Maturity', 'Birthday', 'Anniversary', 'Health Checkup', 'Follow-up', 'Custom'],
    required: [true, 'Reminder type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled', 'Snoozed'],
    default: 'Pending'
  },
  frequency: {
    type: String,
    enum: ['One-Time', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: 'One-Time'
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  notificationChannels: [{
    type: String,
    enum: ['Email', 'SMS', 'WhatsApp', 'In-App']
  }],
  notificationSchedule: [{
    daysBeforeDue: {
      type: Number,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  snoozeUntil: {
    type: Date
  },
  amount: {
    type: Number,
    min: 0
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
reminderSchema.index({ client: 1, status: 1 });
reminderSchema.index({ dueDate: 1, status: 1 });
reminderSchema.index({ reminderType: 1, status: 1 });
reminderSchema.index({ assignedAgent: 1, status: 1 });

// Virtual for days until due
reminderSchema.virtual('daysUntilDue').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for overdue status
reminderSchema.virtual('isOverdue').get(function() {
  if (this.status !== 'Pending') return false;
  const today = new Date();
  return this.dueDate < today;
});

// Method to mark as completed
reminderSchema.methods.complete = function(agentId) {
  this.status = 'Completed';
  this.completedAt = new Date();
  this.completedBy = agentId;
  return this.save();
};

// Method to snooze reminder
reminderSchema.methods.snooze = function(days) {
  this.status = 'Snoozed';
  const snoozeDate = new Date();
  snoozeDate.setDate(snoozeDate.getDate() + days);
  this.snoozeUntil = snoozeDate;
  return this.save();
};

// Static method to get upcoming reminders
reminderSchema.statics.getUpcoming = function(days = 7) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.find({
    status: 'Pending',
    dueDate: {
      $gte: today,
      $lte: futureDate
    }
  }).sort({ dueDate: 1 });
};

// Static method to get overdue reminders
reminderSchema.statics.getOverdue = function() {
  const today = new Date();
  
  return this.find({
    status: 'Pending',
    dueDate: { $lt: today }
  }).sort({ dueDate: 1 });
};

module.exports = mongoose.model('Reminder', reminderSchema);
