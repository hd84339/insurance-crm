const express = require('express');
const router = express.Router();
const {
  getPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getPolicyStats,
  getUpcomingRenewals,
  getMaturedPolicies
} = require('../controllers/policyController');

router.route('/')
  .get(getPolicies)
  .post(createPolicy);

router.route('/stats/overview')
  .get(getPolicyStats);

router.route('/renewal/upcoming')
  .get(getUpcomingRenewals);

router.route('/maturity/list')
  .get(getMaturedPolicies);

router.route('/:id')
  .get(getPolicy)
  .put(updatePolicy)
  .delete(deletePolicy);

module.exports = router;
