const mongoose = require('mongoose');
const validator = require('validator');

const validateUrl = (link) => validator.isURL(link);

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'Wrong image url format',
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'Wrong trailer url format',
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'Wrong thumbnail url format',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  movieId: {
    type: Number,
    require: true,
  },

  nameRu: {
    tyope: String,
    require: true,
  },

  nameEn: {
    tyope: String,
    require: true,
  },
});

module.exports = movieSchema;
