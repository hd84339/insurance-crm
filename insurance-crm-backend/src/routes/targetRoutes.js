const express = require('express');
const router = express.Router();
const {
  getTargets,
  getTarget,
  createTarget,
  updateTarget,
  deleteTarget,
  getTargetStats,
  getAgentActiveTargets,
  getAgentPerformance
} = require('../controllers/targetController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router.route('/')
  .get(getTargets)
  .post(authorize('admin', 'manager'), createTarget);

router.route('/stats/overview')
  .get(getTargetStats);

router.route('/agent/:agentId/active')
  .get(getAgentActiveTargets);

router.route('/agent/:agentId/performance')
  .get(getAgentPerformance);

router.route('/:id')
  .get(getTarget)
  .put(authorize('admin', 'manager'), updateTarget)
  .delete(authorize('admin', 'manager'), deleteTarget);

module.exports = router;
