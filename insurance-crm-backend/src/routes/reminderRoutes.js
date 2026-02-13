const express = require('express');
const router = express.Router();
const {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  completeReminder,
  snoozeReminder,
  deleteReminder,
  getReminderStats,
  getUpcomingReminders,
  getOverdueReminders
} = require('../controllers/reminderController');

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.route('/stats/overview')
  .get(getReminderStats);

router.route('/upcoming/:days')
  .get(getUpcomingReminders);

router.route('/overdue/list')
  .get(getOverdueReminders);

router.route('/:id')
  .get(getReminder)
  .put(updateReminder)
  .delete(deleteReminder);

router.route('/:id/complete')
  .patch(completeReminder);

router.route('/:id/snooze')
  .patch(snoozeReminder);

module.exports = router;
