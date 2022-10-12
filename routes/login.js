const router = require('express').Router();

const { userLoginValidator, userRegisterValidator } = require('../utils/validators');

const { login, createUser } = require('../controllers/user');

router.post('/sinin', userLoginValidator, login);
router.post('/singin', userRegisterValidator, createUser);

module.exports = router;
