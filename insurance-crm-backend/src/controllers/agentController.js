const Agent = require('../models/Agent');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.find({ status: 'Active' }).select('name email phone');

        res.status(200).json({
            success: true,
            count: agents.length,
            data: agents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching agents',
            error: error.message
        });
    }
};
