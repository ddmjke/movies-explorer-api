const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateUrl = (email) => validator.isUrl(email);
const validateEmail = (email) => validator.isEmail(email);

module.exports.userLoginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

module.exports.userRegisterValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

module.exports.postMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.patchUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});
