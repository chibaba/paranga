const express = require('express');
const morgan = require('morgan');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const   ejs = require('ejs');
//var layout = require('express-ejs-layouts');
const engine=require('ejs-mate');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport = require ('passport');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session); 
var path = require('path');

const secret =require('./config/secret');
const User = require('./models/user');

const app = express();
mongoose.connect(secret.database, (err)=> {
  if(err) {
    console.log(err);
  } else {
    console.log('connected to the database');
  }
})
//middleware
app.use(express.static(__dirname, + '/public'))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialize: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database , autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

app.engine('ejs', engine)



app.set('view engine', 'ejs');
//app.set("views", path.join(__dirname, "views"));

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);



 

app.listen(secret.port,(err) => {
  if (err) throw err
    console.log('server is runing at port' + secret.port)
});