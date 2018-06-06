

const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const passportConf = require('../config/passport');


router.get('/login', (req,res)=>{
  if(req.user) return res.redirect('/');
  res.render('accounts/login',  { message: req.flash('logginMessage')});
})

router.post('/login', passport.authenticate('Local-login', {
 successRedirect: '/profile',
 failureRedirect: '/login',
 failureFlash: true
}));

router.get('/profile', function(req, res, next){
  User.findById({ _id: req.user.id}, function(err, user){ 
    if (err) return next(err);

    res.render('accounts/profile', { user: user})
  })
})

router.get('/signup', function(req, res, next){
    
 res.render( 'accounts/signup',{
   errors: req.flash('errors')
 },
 {user:{profile:{name: 'chibaba'}}}
 //{ errors: req.flash('errors') }

    );
}); 
router.post('/signup', function(req, res, next){
  const user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.profile.picture = user.gravatar()

  User.findOne({ email: req.body.email }, function(err, existingUser){
    if(existingUser) {
      req.flash('errors', 'Account with that email address already exist');
      return res.redirect('/signup');
    } else  {
      user.save(function(err,user){
        if(err) return next(err);
        req.logIn(user, function(err){
          if(err) return next(err) 
            res.redirect('/profile');
          });
        })
      };
    }); 
  });

router.get('/logout',(req, res, next) =>{
  req.logout();
  res.redirect('/');
});

module.exports = router;