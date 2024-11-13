// userController.js
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/profiles',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('profilePicture');

// User Management
exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({
    success: true,
    data: users
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { id } = req.params;
      const updates = { ...req.body };

      if (req.file) {
        const user = await User.findById(id);
        if (user.profilePicture) {
          try {
            await fs.unlink(path.join(__dirname, '..', user.profilePicture));
          } catch (error) {
            console.error('Error deleting old profile picture:', error);
          }
        }
        updates.profilePicture = `/uploads/profiles/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

exports.updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  if (!isPasswordComplex(req.body.newPassword)) {
    throw new AppError(
      'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
      400
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Delete profile picture if exists
  if (user.profilePicture) {
    try {
      await fs.unlink(path.join(__dirname, '..', user.profilePicture));
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// 2FA Management
exports.enableTwoFactor = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+twoFactorSecret');
  
  if (user.twoFactorEnabled) {
    throw new AppError('Two-factor authentication is already enabled', 400);
  }

  const secret = speakeasy.generateSecret();
  user.twoFactorSecret = secret.base32;
  await user.save();

  const otpAuthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: process.env.APP_NAME,
    issuer: process.env.APP_NAME,
    encoding: 'base32'
  });

  res.json({
    success: true,
    data: {
      secret: secret.base32,
      otpAuthUrl
    }
  });
});

exports.disableTwoFactor = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user.twoFactorEnabled) {
    throw new AppError('Two-factor authentication is not enabled', 400);
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Two-factor authentication disabled successfully'
  });
});

// Device Management
exports.getActiveDevices = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    success: true,
    data: user.activeDevices
  });
});

exports.removeDevice = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  await user.removeDevice(req.params.deviceId);

  res.json({
    success: true,
    message: 'Device removed successfully'
  });
});

// Create new user with profile picture
exports.createUser = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { email } = req.body;
      let user = await User.findOne({ email });
      
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const userData = {
        ...req.body,
        profilePicture: req.file ? `/uploads/profiles/${req.file.filename}` : null
      };

      user = new User(userData);
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json(userResponse);
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};
