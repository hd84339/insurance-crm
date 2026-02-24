const Task = require('../models/Task');
const Client = require('../models/Client');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            taskType,
            status,
            priority,
            client,
            assignedTo,
            upcoming,
            overdue,
            sortBy = 'dueDate'
        } = req.query;

        // Build query
        const query = {};

        // Role-based filtering
        if (req.user.role === 'agent') {
            query.assignedTo = req.user.id;
        } else if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        if (taskType) query.taskType = taskType;
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (client) query.client = client;

        // Filter for upcoming tasks
        if (upcoming) {
            const days = parseInt(upcoming);
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + days);
            query.dueDate = { $gte: today, $lte: futureDate };
            query.status = 'Pending';
        }

        // Filter for overdue tasks
        if (overdue === 'true') {
            query.dueDate = { $lt: new Date() };
            query.status = 'Pending';
        }

        // Execute query with pagination
        const tasks = await Task.find(query)
            .populate('client', 'name email phone')
            .populate('policy', 'policyNumber company')
            .populate('assignedTo', 'name email')
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count
        const count = await Task.countDocuments(query);

        res.status(200).json({
            success: true,
            count: tasks.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('client', 'name email phone')
            .populate('policy', 'policyNumber company premiumAmount')
            .populate('assignedTo', 'name email')
            .populate('completedBy', 'name');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Role-based access check
        if (req.user.role === 'agent' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching task',
            error: error.message
        });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        // Verify client exists
        const client = await Client.findById(req.body.client);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const taskData = {
            ...req.body,
            createdBy: req.user.id
        };

        const task = await Task.create(taskData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Role-based access check
        if (req.user.role === 'agent' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

// @desc    Mark task as complete
// @route   PATCH /api/tasks/:id/complete
// @access  Private
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Role-based access check
        if (req.user.role === 'agent' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to complete this task' });
        }

        await task.complete(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Task marked as complete',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error completing task',
            error: error.message
        });
    }
};

// @desc    Snooze task
// @route   PATCH /api/tasks/:id/snooze
// @access  Private
exports.snoozeTask = async (req, res) => {
    try {
        const { days = 1 } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Role-based access check
        if (req.user.role === 'agent' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to snooze this task' });
        }

        await task.snooze(parseInt(days));

        res.status(200).json({
            success: true,
            message: `Task snoozed for ${days} day(s)`,
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error snoozing task',
            error: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Role-based access check
        if (req.user.role === 'agent' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats/overview
// @access  Private
exports.getTaskStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const query = { status: 'Pending' };
        if (req.user.role === 'agent') {
            query.assignedTo = req.user.id;
        }

        // Today's tasks
        const todayTasks = await Task.countDocuments({
            ...query,
            dueDate: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        // Upcoming (next 7 days)
        let upcomingQuery = {
            ...query,
            dueDate: {
                $gte: today,
                $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            }
        };
        const upcomingTasksCount = await Task.countDocuments(upcomingQuery);

        // Overdue
        const overdueQuery = {
            ...query,
            dueDate: { $lt: today }
        };
        const overdueTasksCount = await Task.countDocuments(overdueQuery);

        // Breakdown by type
        const typeBreakdown = await Task.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$taskType',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Breakdown by status
        const statusQuery = {};
        if (req.user.role === 'agent') {
            statusQuery.assignedTo = req.user.id;
        }
        const statusBreakdown = await Task.aggregate([
            {
                $match: statusQuery
            },
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
                today: todayTasks,
                upcoming: upcomingTasksCount,
                overdue: overdueTasksCount,
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

// @desc    Get upcoming tasks
// @route   GET /api/tasks/upcoming/:days
// @access  Private
exports.getUpcomingTasks = async (req, res) => {
    try {
        const days = parseInt(req.params.days) || 7;
        const query = {
            status: 'Pending',
            dueDate: {
                $gte: new Date(),
                $lte: new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
            }
        };

        if (req.user.role === 'agent') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query).sort({ dueDate: 1 }).populate('client', 'name');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming tasks',
            error: error.message
        });
    }
};

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue/list
// @access  Private
exports.getOverdueTasks = async (req, res) => {
    try {
        const query = {
            status: 'Pending',
            dueDate: { $lt: new Date() }
        };

        if (req.user.role === 'agent') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query).sort({ dueDate: 1 }).populate('client', 'name');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching overdue tasks',
            error: error.message
        });
    }
};
