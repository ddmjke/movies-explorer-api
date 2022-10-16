const jwt = require('jsonwebtoken');
const { PRODUCTION_SECRET } = require('../utils/config');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearer = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Unauthorized'));
  }
  const token = extractBearer(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : PRODUCTION_SECRET,
    );
  } catch (err) {
    next(new UnauthorizedError('Unauthorized'));
  }
  req.user = payload;
  next();
};
