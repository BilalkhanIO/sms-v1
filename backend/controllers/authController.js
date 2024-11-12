// authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/email');

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

// Auth Controller
exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'STUDENT'
  });

  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email',
      html: `
        <h1>Welcome to ${process.env.APP_NAME}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  } catch (error) {
    // If email fails, still create user but log error
    console.error('Verification email failed:', error);
  }

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
  const deviceInfo = {
    deviceId: req.body.deviceId || req.headers['x-device-id'],
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };

  const user = await User.findOne({ email })
    .select('+password +failedLoginAttempts +lockUntil +twoFactorEnabled +twoFactorSecret');

  if (!user || !(await user.matchPassword(password))) {
    if (user) {
      await user.incrementLoginAttempts();
    }
    throw new AppError('Invalid credentials', 401);
  }

  if (user.isLocked()) {
    throw new AppError('Account is locked. Please try again later.', 423);
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is not active. Please verify your email.', 403);
  }

  // Handle 2FA if enabled
  if (user.twoFactorEnabled) {
    if (!req.body.twoFactorToken) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        message: 'Please provide 2FA token'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: req.body.twoFactorToken,
      window: 1
    });

    if (!verified) {
      throw new AppError('Invalid 2FA token', 401);
    }
  }

  await user.resetLoginAttempts();
  await user.addDevice(deviceInfo);

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

  const resetToken = user.generatePasswordResetToken();
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
        <p>If you didn't request this, please ignore this email.</p>
        <p>IP Address of requester: ${req.ip}</p>
        <p>Time of request: ${new Date().toISOString()}</p>
      `
    });

    res.json({
      success: true,
      message: 'Password reset link sent if email exists'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
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
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }

  if (!isPasswordComplex(req.body.password)) {
    throw new AppError(
      'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
      400
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.emailVerified = true;
  user.status = 'ACTIVE';
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
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
