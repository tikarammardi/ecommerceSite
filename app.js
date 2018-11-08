let express = require('express');
let path = require('path');
let expressValidator = require('express-validator');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bodyParser = require('body-parser');
let flash = require('connect-flash');

//Setting our routes
let index = require('./routes/index');
let users = require('./routes/users');
let shoppingCart = require('./routes/shoppingcart');

let app = express();

//View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//set Static Folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/css',express.static(__dirname +'/node_modules/bootstrap/dist/css'));

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  // Connect-Flash Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',(req,res,next)=> {
    res.locals.user = req.user || null; //creating global variable
    next();
})

//define routes
app.use('/',index);
app.use('/users',users);

const port  = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server Running at port ${port}`);
})