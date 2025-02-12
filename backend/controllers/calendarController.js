// controllers/calendarController.js
import Calendar from '../models/Calendar.js';
import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity.js';

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, participants } = req.body;

  const event = await Calendar.create({
    ...req.body,
    createdBy: req.user.id,
    participants: participants || []
  });

  await Activity.logActivity({
    userId: req.user.id,
    type: 'SYSTEM',
    description: `Created event: ${title}`,
    metadata: { eventId: event._id },
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(event);
});

// @desc    Get events within date range
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  
  const filter = {
    start: { $lte: new Date(end) },
    end: { $gte: new Date(start) }
  };

  const events = await Calendar.find(filter)
    .populate('createdBy', 'firstName lastName')
    .populate('participants', 'firstName lastName role');

  res.json(events);
});

export { createEvent, getEvents };







