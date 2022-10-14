const Movie = require('../models/movie');

const DefaultError = require('../utils/errors/DefaultError');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch(() => next(new DefaultError('internal server error')));
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRu,
    nameEn,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRu,
    nameEn,
    owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('bad request'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.deleteMovieId = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((movie) => {
      if (!(movie.owner.equals(req.user._id))) {
        throw new ForbiddenError();
      }
      movie.remove()
        .then((deleted) => res.send(deleted))
        .catch((err) => {
          if (err.message === 'NotFound') {
            next(new NotFoundError());
          } else {
            next(new DefaultError());
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};
