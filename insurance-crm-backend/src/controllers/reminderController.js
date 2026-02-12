const Reminder = require('../models/Reminder');
const Client = require('../models/Client');

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      reminderType,
      status,
      priority,
      client,
      assignedAgent,
      upcoming,
      overdue,
      sortBy = 'dueDate'
    } = req.query;

    // Build query
    const query = {};
    
    if (reminderType) query.reminderType = reminderType;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (client) query.client = client;
    if (assignedAgent) query.assignedAgent = assignedAgent;
    
    // Filter for upcoming reminders
    if (upcoming) {
      const days = parseInt(upcoming);
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      query.dueDate = { $gte: today, $lte: futureDate };
      query.status = 'Pending';
    }
    
    // Filter for overdue reminders
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = 'Pending';
    }

    // Execute query with pagination
    const reminders = await Reminder.find(query)
      .populate('client', 'name email phone')
      .populate('policy', 'policyNumber company')
      .populate('assignedAgent', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Reminder.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reminders.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message
    });
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('policy', 'policyNumber company premiumAmount')
      .populate('assignedAgent', 'name email')
      .populate('completedBy', 'name');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reminder',
      error: error.message
    });
  }
};

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    // Verify client exists
    const client = await Client.findById(req.body.client);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const reminder = await Reminder.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating reminder',
      error: error.message
    });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating reminder',
      error: error.message
    });
  }
};

// @desc    Mark reminder as complete
// @route   PATCH /api/reminders/:id/complete
// @access  Private
exports.completeReminder = async (req, res) => {
  try {
    const { agentId } = req.body;
    
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    await reminder.complete(agentId);

    res.status(200).json({
      success: true,
      message: 'Reminder marked as complete',
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error completing reminder',
      error: error.message
    });
  }
};

// @desc    Snooze reminder
// @route   PATCH /api/reminders/:id/snooze
// @access  Private
exports.snoozeReminder = async (req, res) => {
  try {
    const { days = 1 } = req.body;
    
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    await reminder.snooze(parseInt(days));

    res.status(200).json({
      success: true,
      message: `Reminder snoozed for ${days} day(s)`,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error snoozing reminder',
      error: error.message
    });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message
    });
  }
};

// @desc    Get reminder statistics
// @route   GET /api/reminders/stats/overview
// @access  Private
exports.getReminderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's reminders
    const todayReminders = await Reminder.countDocuments({
      status: 'Pending',
      dueDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Upcoming (next 7 days)
    const upcomingReminders = await Reminder.getUpcoming(7);

    // Overdue
    const overdueReminders = await Reminder.getOverdue();

    // Breakdown by type
    const typeBreakdown = await Reminder.aggregate([
      {
        $match: { status: 'Pending' }
      },
      {
        $group: {
          _id: '$reminderType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Breakdown by status
    const statusBreakdown = await Reminder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: todayReminders,
        upcoming: upcomingReminders.length,
        overdue: overdueReminders.length,
        typeBreakdown,
        statusBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Get upcoming reminders
// @route   GET /api/reminders/upcoming/:days
// @access  Private
exports.getUpcomingReminders = async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 7;
    const reminders = await Reminder.getUpcoming(days);

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming reminders',
      error: error.message
    });
  }
};

// @desc    Get overdue reminders
// @route   GET /api/reminders/overdue/list
// @access  Private
exports.getOverdueReminders = async (req, res) => {
  try {
    const reminders = await Reminder.getOverdue();

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue reminders',
      error: error.message
    });
  }
};
