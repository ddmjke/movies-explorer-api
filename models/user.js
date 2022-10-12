const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const SALT_WORK_FACTOR = 10;

const validateEmail = (email) => validator.isEmail(email);

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
    validate: {
      validator: validateEmail,
      message: 'Неправильный формат почты',
    },
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

  return bcrypt.hash(user.password, SALT_WORK_FACTOR)
    .then((hash) => {
      user.password = hash;
      return next();
    })
    .catch(() => {
      throw new Error('hash error');
    });
});
