const Calendar = require('../models/Calendar');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all events
exports.getEvents = catchAsync(async (req, res) => {
  const { start, end, type } = req.query;
  const query = { 
    $or: [
      { visibility: 'public' },
      { createdBy: req.user._id },
      { participants: req.user._id }
    ]
  };

  // Add date range filter if provided
  if (start && end) {
    query.start = { $gte: new Date(start) };
    query.end = { $lte: new Date(end) };
  }

  // Add type filter if provided
  if (type) {
    query.type = type;
  }

  const events = await Calendar.find(query)
    .populate('createdBy', 'name')
    .populate('participants', 'name');

  res.json(events);
});

// Create new event
exports.createEvent = catchAsync(async (req, res) => {
  const eventData = {
    ...req.body,
    createdBy: req.user._id
  };

  const event = await Calendar.create(eventData);
  await event.populate('createdBy', 'name');
  await event.populate('participants', 'name');

  res.status(201).json(event);
});

// Update event
exports.updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const event = await Calendar.findById(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user has permission to update
  if (event.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this event', 403);
  }

  const updatedEvent = await Calendar.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name')
    .populate('participants', 'name');

  res.json(updatedEvent);
});

// Delete event
exports.deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const event = await Calendar.findById(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user has permission to delete
  if (event.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this event', 403);
  }

  await event.deleteOne();
  res.status(204).send();
});

// Get event by ID
exports.getEventById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const event = await Calendar.findById(id)
    .populate('createdBy', 'name')
    .populate('participants', 'name');

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user has permission to view
  if (
    event.visibility !== 'public' &&
    event.createdBy.toString() !== req.user._id.toString() &&
    !event.participants.includes(req.user._id)
  ) {
    throw new AppError('Not authorized to view this event', 403);
  }

  res.json(event);
}); 