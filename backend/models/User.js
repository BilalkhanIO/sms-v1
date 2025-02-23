// User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        // Using validator.js for email validation
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // IMPORTANT: Prevent password from being returned in queries
      // validate: {
      //   validator: function (value) {
      //     const complexityRegex =
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      //     return complexityRegex.test(value);
      //   },
      //   message:
      //     "Password must meet complexity requirements: min 8 chars, uppercase, lowercase, number, and special symbol.",
      // },
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"],
      default: "STUDENT",
    },
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "PENDING_EMAIL_VERIFICATION",
        "PENDING_ADMIN_APPROVAL",
        "SUSPENDED",
        "DELETED",
      ],
      default: "PENDING_EMAIL_VERIFICATION",
    },
    profilePicture: {
      type: String,
      default: null, // Or a default image URL
      validate: {
        // Validate as a URL if provided
        validator: function (value) {
          return !value || validator.isURL(value); // Allow null, but validate if it's a string
        },
        message: "Profile picture must be a valid URL",
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true }); // Email must be unique
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Pre-save hook to encrypt password and update passwordChangedAt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = Date.now();
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

const User = model("User", userSchema);
export default User;
