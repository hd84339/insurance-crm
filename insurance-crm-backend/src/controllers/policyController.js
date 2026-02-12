const Policy = require('../models/Policy');
const Client = require('../models/Client');
const Target = require('../models/Target');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private
exports.getPolicies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      policyType,
      company,
      status,
      paymentStatus,
      client,
      assignedAgent,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { policyNumber: { $regex: search, $options: 'i' } },
        { planName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (policyType) query.policyType = policyType;
    if (company) query.company = company;
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (client) query.client = client;
    if (assignedAgent) query.assignedAgent = assignedAgent;

    // Execute query with pagination
    const policies = await Policy.find(query)
      .populate('client', 'name email phone')
      .populate('assignedAgent', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Policy.countDocuments(query);

    res.status(200).json({
      success: true,
      count: policies.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching policies',
      error: error.message
    });
  }
};

// @desc    Get single policy
// @route   GET /api/policies/:id
// @access  Private
exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id)
      .populate('client', 'name email phone address')
      .populate('assignedAgent', 'name email phone');

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching policy',
      error: error.message
    });
  }
};

// @desc    Create new policy
// @route   POST /api/policies
// @access  Private
exports.createPolicy = async (req, res) => {
  try {
    // Verify client exists
    const client = await Client.findById(req.body.client);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const policy = await Policy.create(req.body);

    // Update targets if agent is assigned
    if (policy.assignedAgent) {
      await Target.updateFromPolicy(policy);
    }

    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating policy',
      error: error.message
    });
  }
};

// @desc    Update policy
// @route   PUT /api/policies/:id
// @access  Private
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Policy updated successfully',
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating policy',
      error: error.message
    });
  }
};

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Policy deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting policy',
      error: error.message
    });
  }
};

// @desc    Get policy statistics
// @route   GET /api/policies/stats/overview
// @access  Private
exports.getPolicyStats = async (req, res) => {
  try {
    const stats = await Policy.aggregate([
      {
        $group: {
          _id: null,
          totalPolicies: { $sum: 1 },
          totalPremium: { $sum: '$premiumAmount' },
          totalSumAssured: { $sum: '$sumAssured' },
          activePolicies: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          }
        }
      }
    ]);

    const policyTypeBreakdown = await Policy.aggregate([
      {
        $group: {
          _id: '$policyType',
          count: { $sum: 1 },
          totalPremium: { $sum: '$premiumAmount' }
        }
      },
      { $sort: { totalPremium: -1 } }
    ]);

    const companyBreakdown = await Policy.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          totalPremium: { $sum: '$premiumAmount' }
        }
      },
      { $sort: { totalPremium: -1 } }
    ]);

    const statusBreakdown = await Policy.aggregate([
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
        overview: stats[0] || {},
        policyTypeBreakdown,
        companyBreakdown,
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

// @desc    Get policies due for renewal
// @route   GET /api/policies/renewal/upcoming
// @access  Private
exports.getUpcomingRenewals = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const policies = await Policy.find({
      status: 'Active',
      renewalDate: {
        $gte: today,
        $lte: futureDate
      }
    })
      .populate('client', 'name email phone')
      .sort('renewalDate');

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming renewals',
      error: error.message
    });
  }
};

// @desc    Get matured policies
// @route   GET /api/policies/maturity/list
// @access  Private
exports.getMaturedPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({
      status: 'Matured'
    })
      .populate('client', 'name email phone')
      .sort('-maturityDate');

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching matured policies',
      error: error.message
    });
  }
};
