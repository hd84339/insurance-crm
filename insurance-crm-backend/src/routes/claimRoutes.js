const express = require('express');
const router = express.Router();
const {
  getClaims,
  getClaim,
  createClaim,
  updateClaim,
  updateClaimStatus,
  deleteClaim,
  getClaimStats,
  getPendingClaims
} = require('../controllers/claimController');
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router.route('/')
  .get(getClaims)
  .post(createClaim);

router.route('/stats/overview')
  .get(getClaimStats);

router.route('/pending/list')
  .get(getPendingClaims);

router.route('/:id')
  .get(getClaim)
  .put(updateClaim)
  .delete(deleteClaim);

router.route('/:id/status')
  .patch(updateClaimStatus);

module.exports = router;
