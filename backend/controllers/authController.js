const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      issuedAt: Date.now(),
      jti: crypto.randomBytes(16).toString('hex')
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '1d',
      algorithm: 'HS256'
    }
  );
};

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('Email already registered', 400);
  }

  // Create user with additional security fields
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'STUDENT',
    loginAttempts: 0,
    lastLoginAttempt: null
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +loginAttempts +lastLoginAttempt');
  
  // Implement login attempt tracking
  if (user) {
    if (user.loginAttempts >= 5 && Date.now() - user.lastLoginAttempt < 15 * 60 * 1000) {
      throw new AppError('Account temporarily locked. Please try again later.', 429);
    }
    
    if (!(await user.matchPassword(password))) {
      user.loginAttempts += 1;
      user.lastLoginAttempt = Date.now();
      await user.save();
      throw new AppError('Invalid credentials', 401);
    }
  } else {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is inactive', 403);
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lastLoginAttempt = null;
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new AppError('Password reset link sent if email exists', 200);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please change your password immediately.</p>
        <p>IP Address of requester: ${req.ip}</p>
        <p>Time of request: ${new Date().toISOString()}</p>
      `
    });

    res.json({
      success: true,
      message: 'Password reset link sent if email exists'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Error sending email. Please try again later.', 500);
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }

  // Validate password complexity
  if (!isPasswordComplex(req.body.password)) {
    throw new AppError(
      'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
      400
    );
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. Please login with your new password.'
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  if (await bcrypt.compare(req.body.newPassword, user.password)) {
    throw new AppError('New password must be different from current password', 400);
  }

  if (!isPasswordComplex(req.body.newPassword)) {
    throw new AppError(
      'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
      400
    );
  }

  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully. Please login with your new password.'
  });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -passwordChangedAt -loginAttempts');
  res.json({
    success: true,
    data: user
  });
});

// Helper function for password complexity
function isPasswordComplex(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
}
