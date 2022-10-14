const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { JWT_SALT_FACTOR } = require('../utils/config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre('save', function named(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  return bcrypt.hash(user.password, JWT_SALT_FACTOR)
    .then((hash) => {
      user.password = hash;
      return next();
    })
    .catch(() => {
      throw new Error('hash error');
    });
});

module.exports = mongoose.model('user', userSchema);
