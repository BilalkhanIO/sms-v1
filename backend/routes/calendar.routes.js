const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all calendar routes

router.route('/')
  .get(calendarController.getEvents)
  .post(calendarController.createEvent);

router.route('/:id')
  .get(calendarController.getEventById)
  .put(calendarController.updateEvent)
  .delete(calendarController.deleteEvent);

module.exports = router; 