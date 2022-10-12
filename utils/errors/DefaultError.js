class DefaultError extends Error {
  constructor(message) {
    super(message || 'Internal server error');
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
