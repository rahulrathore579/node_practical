const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { checkAlreadyLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/register', checkAlreadyLoggedIn, (req, res) => {
  res.render('register');
});

router.post('/register', checkAlreadyLoggedIn, (req, res) => {
  const result = User.create({
    username: req.body.username,
    password: req.body.password,
    fullName: req.body.fullName,
    profession: req.body.profession
  });

  if (!result.success) {
    return res.render('register', { error: result.message });
  }

  res.redirect('/login');
});

router.get('/login', checkAlreadyLoggedIn, (req, res) => {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect('/projects');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

module.exports = router;
