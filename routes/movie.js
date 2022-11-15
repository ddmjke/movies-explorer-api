const router = require('express').Router();
const { getMovies, postMovie, deleteMovieId } = require('../controllers/movie');
const { postMovieValidator, deleteMoviesValidator } = require('../utils/validators');

router.get('/movies', getMovies);
router.post('/movies', postMovieValidator, postMovie);
// router.delete('/movies/:movieId', deleteMoviesValidator, deleteMovieId);
router.delete('/movies/:movieId', deleteMovieId);

module.exports = router;
