module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // This "next" sends the error to our Global Middleware
  };
};