// This is a special middleware with 4 arguments (err, req, res, next)
// Express knows this is the "Error Handler"
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    message: err.message || 'Something went very wrong!'
  });
};