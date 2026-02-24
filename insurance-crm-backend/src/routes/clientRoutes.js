const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientPolicies
} = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/stats/overview')
  .get(getClientStats);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

router.route('/:id/policies')
  .get(getClientPolicies);

module.exports = router;
