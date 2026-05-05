const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    const user = User.findByUsername(username);
    
    if (!user) {
      return done(null, false, { message: 'Username not found' });
    }

    if (!User.verifyPassword(password, user.password)) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, user);
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/projects');
  }
  res.redirect('/login');
});

// User routes (auth)
app.use('/', userRoutes);

// Project routes
app.use('/', projectRoutes);

// Handle PUT and DELETE methods via POST
app.post('/:path(*)', (req, res, next) => {
  if (req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
