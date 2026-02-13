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

router.route('/')
  .get(getTargets)
  .post(createTarget);

router.route('/stats/overview')
  .get(getTargetStats);

router.route('/agent/:agentId/active')
  .get(getAgentActiveTargets);

router.route('/agent/:agentId/performance')
  .get(getAgentPerformance);

router.route('/:id')
  .get(getTarget)
  .put(updateTarget)
  .delete(deleteTarget);

module.exports = router;
