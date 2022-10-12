const router = require('express').Router();

const { userLoginValidator, userRegisterValidator } = require('../utils/validators');

const { login, createUser } = require('../controllers/user');

router.post('/signin', userLoginValidator, login);
router.post('/signup', userRegisterValidator, createUser);

module.exports = router;
