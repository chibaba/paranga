
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// serialize and deserialize
passport.serializeUser((user, done)=> {
  done(null, user._id);
}); 

passport.deserializeUser((id, done) =>{
  User.findById(Id, (err, user)=>{
    done(err, user);
  });
});


// midleware
passport.use('Local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done)=>{
  User.findOne ({ email: email}, (err, user)=>{

    if(err) return done(err);
    
    if(!user) {
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }
    
    if(!user.comparePassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Ooops! Wrong Message myguy'));
    }
    return done(null, user);
  })


}))



//custom function to validate

exports.isAuthenticated = (req, res, next)=>{
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}