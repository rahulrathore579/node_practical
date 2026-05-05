const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    const user = User.findByUsername(username);
    if (!user) {
      return done(null, false);
    }
    if (!User.verifyPassword(password, user.password)) {
      return done(null, false);
    }
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/projects');
  }
  res.redirect('/login');
});

app.use('/', userRoutes);
app.use('/', projectRoutes);

app.post('/:path(*)', (req, res, next) => {
  if (req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
