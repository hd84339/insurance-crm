const Claim = require('../models/Claim');
const Policy = require('../models/Policy');

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private
exports.getClaims = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      claimType,
      priority,
      client,
      policy,
      assignedTo,
      sortBy = '-claimDate'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { claimNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (claimType) query.claimType = claimType;
    if (priority) query.priority = priority;
    if (client) query.client = client;
    if (policy) query.policy = policy;
    if (assignedTo) query.assignedTo = assignedTo;

    // Execute query with pagination
    const claims = await Claim.find(query)
      .populate('client', 'name email phone')
      .populate('policy', 'policyNumber company policyType')
      .populate('assignedTo', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Claim.countDocuments(query);

    res.status(200).json({
      success: true,
      count: claims.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claims',
      error: error.message
    });
  }
};

// @desc    Get single claim
// @route   GET /api/claims/:id
// @access  Private
exports.getClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('client', 'name email phone address')
      .populate('policy', 'policyNumber company policyType premiumAmount sumAssured')
      .populate('assignedTo', 'name email phone')
      .populate('statusHistory.updatedBy', 'name');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claim',
      error: error.message
    });
  }
};

// @desc    Create new claim
// @route   POST /api/claims
// @access  Private
exports.createClaim = async (req, res) => {
  try {
    // Verify policy exists
    const policy = await Policy.findById(req.body.policy);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    // Set client from policy if not provided
    if (!req.body.client) {
      req.body.client = policy.client;
    }

    // Generate claim number if not provided
    if (!req.body.claimNumber) {
      const lastClaim = await Claim.findOne().sort('-claimNumber').limit(1);
      const lastNumber = lastClaim ? parseInt(lastClaim.claimNumber.split('-')[1]) : 0;
      req.body.claimNumber = `CLM-${String(lastNumber + 1).padStart(6, '0')}`;
    }

    const claim = await Claim.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Claim created successfully',
      data: claim
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating claim',
      error: error.message
    });
  }
};

// @desc    Update claim
// @route   PUT /api/claims/:id
// @access  Private
exports.updateClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Claim updated successfully',
      data: claim
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating claim',
      error: error.message
    });
  }
};

// @desc    Update claim status
// @route   PATCH /api/claims/:id/status
// @access  Private
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, note, updatedBy } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    claim.status = status;
    
    // Add to status history
    claim.statusHistory.push({
      status,
      note,
      updatedBy,
      date: new Date()
    });

    // Set settlement date if approved
    if (status === 'Settled') {
      claim.settlementDate = new Date();
    }

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim status updated successfully',
      data: claim
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating claim status',
      error: error.message
    });
  }
};

// @desc    Delete claim
// @route   DELETE /api/claims/:id
// @access  Private
exports.deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting claim',
      error: error.message
    });
  }
};

// @desc    Get claim statistics
// @route   GET /api/claims/stats/overview
// @access  Private
exports.getClaimStats = async (req, res) => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: null,
          totalClaims: { $sum: 1 },
          totalClaimAmount: { $sum: '$claimAmount' },
          totalApprovedAmount: { $sum: '$approvedAmount' },
          approvedClaims: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
          },
          rejectedClaims: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          pendingClaims: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          settledClaims: {
            $sum: { $cond: [{ $eq: ['$status', 'Settled'] }, 1, 0] }
          }
        }
      }
    ]);

    const statusBreakdown = await Claim.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' }
        }
      }
    ]);

    const claimTypeBreakdown = await Claim.aggregate([
      {
        $group: {
          _id: '$claimType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Average processing time for settled claims
    const processingTime = await Claim.aggregate([
      {
        $match: { status: 'Settled', settlementDate: { $exists: true } }
      },
      {
        $project: {
          processingDays: {
            $divide: [
              { $subtract: ['$settlementDate', '$claimDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageProcessingDays: { $avg: '$processingDays' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        statusBreakdown,
        claimTypeBreakdown,
        averageProcessingDays: processingTime[0]?.averageProcessingDays || 0
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

// @desc    Get pending claims
// @route   GET /api/claims/pending/list
// @access  Private
exports.getPendingClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      status: { $in: ['Pending', 'Under Review'] }
    })
      .populate('client', 'name phone')
      .populate('policy', 'policyNumber company')
      .sort('priority -claimDate');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending claims',
      error: error.message
    });
  }
};
