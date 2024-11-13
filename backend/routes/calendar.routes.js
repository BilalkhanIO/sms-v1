const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all calendar routes

// GET /api/calendar/events - Get all events
router.get('/events', calendarController.getEvents);

// POST /api/calendar/events - Create new event
router.post('/events', calendarController.createEvent);

// PUT /api/calendar/events/:id - Update event
router.put('/events/:id', calendarController.updateEvent);

// DELETE /api/calendar/events/:id - Delete event
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router; 