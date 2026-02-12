const Client = require('../models/Client');
const Policy = require('../models/Policy');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      clientType,
      priority,
      assignedAgent,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (clientType) query.clientType = clientType;
    if (priority) query.priority = priority;
    if (assignedAgent) query.assignedAgent = assignedAgent;

    // Execute query with pagination
    const clients = await Client.find(query)
      .populate('assignedAgent', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      count: clients.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedAgent', 'name email phone')
      .populate({
        path: 'policies',
        select: 'policyNumber policyType company premiumAmount status'
      });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
  try {
    // Check if client has active policies
    const activePolicies = await Policy.countDocuments({
      client: req.params.id,
      status: 'Active'
    });

    if (activePolicies > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete client with ${activePolicies} active policies`
      });
    }

    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

// @desc    Get client statistics
// @route   GET /api/clients/stats/overview
// @access  Private
exports.getClientStats = async (req, res) => {
  try {
    const stats = await Client.aggregate([
      {
        $group: {
          _id: null,
          totalClients: { $sum: 1 },
          activeClients: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          prospects: {
            $sum: { $cond: ['$isNewProspect', 1, 0] }
          },
          totalPremium: { $sum: '$totalPremium' },
          averagePoliciesPerClient: { $avg: '$totalPolicies' }
        }
      }
    ]);

    const statusBreakdown = await Client.aggregate([
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

// @desc    Get client's policies
// @route   GET /api/clients/:id/policies
// @access  Private
exports.getClientPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ client: req.params.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client policies',
      error: error.message
    });
  }
};
