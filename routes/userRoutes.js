const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { checkAlreadyLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/register', checkAlreadyLoggedIn, (req, res) => {
  res.render('register');
});

router.post('/register', 
  checkAlreadyLoggedIn,
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('profession').trim().notEmpty().withMessage('Profession is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { errors: errors.array() });
    }

    const result = User.create({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      profession: req.body.profession
    });

    if (!result.success) {
      return res.render('register', { errors: [{ msg: result.message }] });
    }

    res.redirect('/login');
  }
);

// Login page
router.get('/login', checkAlreadyLoggedIn, (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    res.redirect('/projects');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.redirect('/login');
  });
});

module.exports = router;
