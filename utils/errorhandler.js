module.exports.errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500)
    .send({
      message: err.statusCode === 500
        ? 'Internal server error'
        : err.message,
    });
  next();
};
