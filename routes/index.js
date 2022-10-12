const router = require('express').Router();
const NotFoundError = require('../utils/errors/NotFoundError');
const auth = require('../middlewares/auth');

router.use(require('./login'));

router.use(auth, require('./user'));
router.use(auth, require('./movie'));

router.use('/*', require('../middlewares/auth'), (req, res, next) => {
  next(new NotFoundError('route not found'));
});

module.exports = router;
