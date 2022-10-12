const router = require('express').Router();
const { NotFoundError } = require('../utils/errors');

router.use(require('./login'));

router.use('./middlewares/auth');

router.use(require('./user'));
router.use(require('./movie'));

router.use((req, res, next) => {
  next(new NotFoundError('route not found'));
});

module.exports = router;
