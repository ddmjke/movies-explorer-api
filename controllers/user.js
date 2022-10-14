const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const DefaultError = require('../utils/errors/DefaultError');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { PRODUCTION_SECRET } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.create({
    name, email, password,
  })
    .then((user) => {
      res.status(201).send({
        _id: user.id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.message === 'Validation failed') {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Email already in use'));
      } else {
        next(new DefaultError());
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Email&password is incorrect');
      } else {
        bcrypt.compare(password, user.password)
          .then((matches) => {
            if (!matches) {
              throw new UnauthorizedError();
            } else {
              const token = jwt.sign(
                { _id: user._id },
                NODE_ENV === 'production' ? JWT_SECRET : PRODUCTION_SECRET,
                { expiresIn: '7d' },
              );
              res.send({ token });
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotFoundError());
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else if (err.code === 11000) {
        next(new ConflictError('Email already in use'));
      } else {
        next(new DefaultError());
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError());
    })
    .then((usr) => res.send(usr))
    .catch(next);
};
