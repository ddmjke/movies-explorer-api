const router = require('express').Router();
const { getUser, patchUser } = require('../controllers/user');
const { patchUserValidator } = require('../utils/validators');

router.get('/users/me', getUser);
router.patch('/users/me', patchUserValidator, patchUser);

module.exports = router;
