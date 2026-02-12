const express = require('express');
const router = express.Router();
const {
  generatePolicyReport,
  generateClaimReport,
  generateRenewalReport,
  generateTargetReport,
  generateClientActivityReport,
  getDashboardStats
} = require('../controllers/reportController');

router.route('/policies')
  .get(generatePolicyReport);

router.route('/claims')
  .get(generateClaimReport);

router.route('/renewals')
  .get(generateRenewalReport);

router.route('/targets')
  .get(generateTargetReport);

router.route('/client-activity')
  .get(generateClientActivityReport);

router.route('/dashboard')
  .get(getDashboardStats);

module.exports = router;
