const Target = require('../models/Target');

// @desc    Get all targets
// @route   GET /api/targets
// @access  Private
exports.getTargets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      agent,
      targetPeriod,
      productType,
      status,
      sortBy = '-startDate'
    } = req.query;

    // Build query
    const query = {};
    
    if (agent) query.agent = agent;
    if (targetPeriod) query.targetPeriod = targetPeriod;
    if (productType) query.productType = productType;
    if (status) query.status = status;

    // Execute query with pagination
    const targets = await Target.find(query)
      .populate('agent', 'name email phone')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Target.countDocuments(query);

    res.status(200).json({
      success: true,
      count: targets.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: targets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching targets',
      error: error.message
    });
  }
};

// @desc    Get single target
// @route   GET /api/targets/:id
// @access  Private
exports.getTarget = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id)
      .populate('agent', 'name email phone licenseNumber');

    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Target not found'
      });
    }

    res.status(200).json({
      success: true,
      data: target
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching target',
      error: error.message
    });
  }
};

// @desc    Create new target
// @route   POST /api/targets
// @access  Private
exports.createTarget = async (req, res) => {
  try {
    const target = await Target.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Target created successfully',
      data: target
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating target',
      error: error.message
    });
  }
};

// @desc    Update target
// @route   PUT /api/targets/:id
// @access  Private
exports.updateTarget = async (req, res) => {
  try {
    const target = await Target.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Target not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Target updated successfully',
      data: target
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating target',
      error: error.message
    });
  }
};

// @desc    Delete target
// @route   DELETE /api/targets/:id
// @access  Private
exports.deleteTarget = async (req, res) => {
  try {
    const target = await Target.findByIdAndDelete(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Target not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Target deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting target',
      error: error.message
    });
  }
};

// @desc    Get target statistics
// @route   GET /api/targets/stats/overview
// @access  Private
exports.getTargetStats = async (req, res) => {
  try {
    const stats = await Target.aggregate([
      {
        $match: { status: 'Active' }
      },
      {
        $group: {
          _id: null,
          totalTargets: { $sum: 1 },
          totalTargetAmount: { $sum: '$targetAmount' },
          totalAchievedAmount: { $sum: '$achievedAmount' },
          averageAchievement: { $avg: '$achievementPercentage' },
          achievedTargets: {
            $sum: { 
              $cond: [{ $gte: ['$achievementPercentage', 100] }, 1, 0] 
            }
          }
        }
      }
    ]);

    const periodBreakdown = await Target.aggregate([
      {
        $match: { status: 'Active' }
      },
      {
        $group: {
          _id: '$targetPeriod',
          count: { $sum: 1 },
          targetAmount: { $sum: '$targetAmount' },
          achievedAmount: { $sum: '$achievedAmount' }
        }
      }
    ]);

    const productTypeBreakdown = await Target.aggregate([
      {
        $match: { status: 'Active' }
      },
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 },
          targetAmount: { $sum: '$targetAmount' },
          achievedAmount: { $sum: '$achievedAmount' }
        }
      }
    ]);

    // Top performers
    const topPerformers = await Target.aggregate([
      {
        $match: { 
          status: 'Active',
          achievementPercentage: { $gt: 0 }
        }
      },
      {
        $sort: { achievementPercentage: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agentInfo'
        }
      },
      {
        $unwind: '$agentInfo'
      },
      {
        $project: {
          agent: {
            _id: '$agentInfo._id',
            name: '$agentInfo.name',
            email: '$agentInfo.email'
          },
          targetAmount: 1,
          achievedAmount: 1,
          achievementPercentage: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        periodBreakdown,
        productTypeBreakdown,
        topPerformers
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

// @desc    Get active targets for agent
// @route   GET /api/targets/agent/:agentId/active
// @access  Private
exports.getAgentActiveTargets = async (req, res) => {
  try {
    const targets = await Target.getActiveTargets(req.params.agentId);

    res.status(200).json({
      success: true,
      count: targets.length,
      data: targets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent targets',
      error: error.message
    });
  }
};

// @desc    Get agent performance summary
// @route   GET /api/targets/agent/:agentId/performance
// @access  Private
exports.getAgentPerformance = async (req, res) => {
  try {
    const { period = 'Monthly' } = req.query;

    const performance = await Target.aggregate([
      {
        $match: {
          agent: req.params.agentId,
          targetPeriod: period
        }
      },
      {
        $group: {
          _id: null,
          totalTargets: { $sum: 1 },
          activeTargets: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          completedTargets: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalTargetAmount: { $sum: '$targetAmount' },
          totalAchievedAmount: { $sum: '$achievedAmount' },
          averageAchievement: { $avg: '$achievementPercentage' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: performance[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent performance',
      error: error.message
    });
  }
};
