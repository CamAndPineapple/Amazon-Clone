const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const passportConfig = require('../config/passport');

router.get('/login', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('../views/accounts/login', {
    message: req.flash('loginMessage')
  })
});

// passport.authenticate middleware
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', function(req, res, next) {
  User.findOne({_id: req.user._id }, function(err, user) {
    if (err) return next(err);
    res.render('../views/accounts/profile', { user: user });
  });
});

router.get('/signup', function(req, res, next) {
  res.render('../views/accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next) {

  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.profile.picture = user.gravatar();

  User.findOne({
    email: req.body.email
  }, function(err, existingUser) {

    if (existingUser) {
      req.flash('errors', 'A user with this email adress already exists');
      console.log(req.body.email + " already exist");
      return res.redirect('/signup');
    } else {
      user.save(function(err, user) {
        if (err) return next(err);

        // add session to server and cookie to browser
        req.logIn(user, function(err) {
          if (err) return next(err);
          res.redirect('/profile');

        });

      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/edit-profile', function(req, res, next) {
  res.render('../views/accounts/edit-profile.ejs', { message: req.flash('success')});
});

router.post('/edit-profile', function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', 'Successfully Edited your Profile');
      return res.redirect('/edit-profile');
    });

  });
});

module.exports = router;
