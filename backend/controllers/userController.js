const User = require('../models/User');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, data: users });
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ success: true, data: user });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { name, email, role, status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ success: true, data: user });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ success: true, data: null });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { name, phoneNumber, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phoneNumber, address },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({ success: true, data: user });
});

exports.uploadProfilePicture = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a file', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePicture: req.file.path },
    { new: true }
  ).select('-password');

  res.json({ success: true, data: user });
}); 