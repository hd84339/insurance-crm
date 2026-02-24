const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    completeTask,
    snoozeTask,
    deleteTask,
    getTaskStats,
    getUpcomingTasks,
    getOverdueTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/stats/overview')
    .get(getTaskStats);

router.route('/upcoming/:days')
    .get(getUpcomingTasks);

router.route('/overdue/list')
    .get(getOverdueTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

router.route('/:id/complete')
    .patch(completeTask);

router.route('/:id/snooze')
    .patch(snoozeTask);

module.exports = router;
