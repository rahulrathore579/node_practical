const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/projects');
  }
  next();
};

module.exports = {
  authenticateUser,
  checkAlreadyLoggedIn
};
