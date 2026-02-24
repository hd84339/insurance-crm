const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client reference is required']
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy'
    },
    taskType: {
        type: String,
        enum: ['Renewal', 'Premium Due', 'Maturity', 'Birthday', 'Anniversary', 'Health Checkup', 'Follow-up', 'Custom'],
        required: [true, 'Task type is required']
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
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        ref: 'User'
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
taskSchema.index({ client: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ taskType: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });

// Virtual for days until due
taskSchema.virtual('daysUntilDue').get(function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function () {
    if (this.status !== 'Pending') return false;
    const today = new Date();
    return this.dueDate < today;
});

// Method to mark as completed
taskSchema.methods.complete = function (userId) {
    this.status = 'Completed';
    this.completedAt = new Date();
    this.completedBy = userId;
    return this.save();
};

// Method to snooze task
taskSchema.methods.snooze = function (days) {
    this.status = 'Snoozed';
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    this.snoozeUntil = snoozeDate;
    return this.save();
};

// Static method to get upcoming tasks
taskSchema.statics.getUpcoming = function (days = 7) {
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

// Static method to get overdue tasks
taskSchema.statics.getOverdue = function () {
    const today = new Date();

    return this.find({
        status: 'Pending',
        dueDate: { $lt: today }
    }).sort({ dueDate: 1 });
};

module.exports = mongoose.model('Task', taskSchema);
