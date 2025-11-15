const mongoose = require('mongoose');
const validation = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const { type } = require('os');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter Your Name'],
  },
  email: {
    type: String,
    required: [true, 'please enter Your Email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validation.isEmail,
      message: 'please enter valid mail Id',
    },
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    select: false,
    required: [true, 'please enter Password'],
    minlenght: [8, 'min length is 8'],
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'password not matching',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.methods.comparePassword = async function (
  ReqBodyPassword,
  DataBasePassword,
) {
  return await bcrypt.compare(ReqBodyPassword, DataBasePassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  const issuedAt = new Date(JWTTimeStamp * 1000);

  if (this.passwordChangedAt) {
    if (this.passwordChangedAt > issuedAt) {
      return false;
      //return next(new AppError('Please login again with new password', 401));
    }
  }
  return true;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10min to millisecs
  return resetToken;
};
// Pre hook - filters only active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); // Only get users where active is not false
  next();
});

// Post hook - logs if no documents found
userSchema.post(/^find/, function (docs, next) {
  if (!docs) {
    next(new AppError('No user found', 400));
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // skip if password not changed
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
