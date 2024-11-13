const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    index: true // Add index for faster queries
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      message: '{VALUE} is not a valid role'
    },
    default: 'STUDENT',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
      message: '{VALUE} is not a valid status'
    },
    default: 'PENDING_VERIFICATION',
    required: true,
    index: true
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now,
    select: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockUntil: {
    type: Date,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    select: false
  },
  activeDevices: [{
    deviceId: String,
    lastActive: Date,
    userAgent: String,
    ip: String
  }],
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s-]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ resetPasswordExpire: 1 }, { sparse: true });
userSchema.index({ emailVerificationExpire: 1 }, { sparse: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 for better security
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 Hour

  return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours

  return verificationToken;
};

// Track login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Increment failed attempts
  this.failedLoginAttempts += 1;

  // Lock account if too many attempts
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
  }

  await this.save();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Track device login
userSchema.methods.addDevice = async function(deviceInfo) {
  const device = {
    deviceId: deviceInfo.deviceId,
    lastActive: Date.now(),
    userAgent: deviceInfo.userAgent,
    ip: deviceInfo.ip
  };

  // Remove old device if exists
  this.activeDevices = this.activeDevices.filter(d => d.deviceId !== deviceInfo.deviceId);
  
  // Add new device
  this.activeDevices.push(device);
  
  // Keep only last 5 devices
  if (this.activeDevices.length > 5) {
    this.activeDevices.shift();
  }

  this.lastLogin = Date.now();
  await this.save();
};

// Remove device
userSchema.methods.removeDevice = async function(deviceId) {
  this.activeDevices = this.activeDevices.filter(d => d.deviceId !== deviceId);
  await this.save();
};

// Method to check password age
userSchema.methods.isPasswordStale = function() {
  const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 days
  return Date.now() - this.lastPasswordChange.getTime() > maxAge;
};

// Add virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
