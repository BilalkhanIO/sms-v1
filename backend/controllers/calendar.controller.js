const Calendar = require('../models/Calendar');
const catchAsync = require('../utils/catchAsync');

exports.getEvents = catchAsync(async (req, res) => {
  // Mock data for demonstration
  const events = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      start: new Date(2024, 1, 15, 10, 0),
      end: new Date(2024, 1, 15, 12, 0),
      description: 'Annual parent-teacher meeting',
      type: 'meeting',
      color: 'indigo'
    },
    {
      id: 2,
      title: 'Final Exams',
      start: new Date(2024, 2, 1),
      end: new Date(2024, 2, 15),
      description: 'Final examination period',
      type: 'exam',
      color: 'red'
    },
    {
      id: 3,
      title: 'Sports Day',
      start: new Date(2024, 2, 20, 9, 0),
      end: new Date(2024, 2, 20, 16, 0),
      description: 'Annual sports day event',
      type: 'event',
      color: 'green'
    }
  ];

  res.status(200).json(events);
});

exports.createEvent = catchAsync(async (req, res) => {
  const event = {
    id: Date.now(),
    ...req.body,
    createdBy: req.user._id
  };

  res.status(201).json(event);
});

exports.updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const event = {
    id: parseInt(id),
    ...req.body,
    updatedAt: new Date()
  };

  res.status(200).json(event);
});

exports.deleteEvent = catchAsync(async (req, res) => {
  res.status(204).send();
}); 