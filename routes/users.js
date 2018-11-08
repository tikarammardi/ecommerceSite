const express = require('express');
const router = express.Router();
let bcrypt = require('bcryptjs');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const connection = require('../config/database');


//Login Page - GET REQUEST
router.get('/login', (req, res) => {
    res.render('login');
});


//Register Page - GET REQUEST
router.get('/register', (req, res) => {
    res.render('register');
});

//logout

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have Logged Out')
    res.redirect('/users/login');

});

//Register Page - POST REQUEST
router.post('/register', (req, res) => {

    // Get Form Values

    let person = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        mobile: req.body.mobile,
        gender: req.body.gender
    }
    //Validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is required').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password Do not match').equals(req.body.password);
    req.checkBody('address', 'Address field is required').notEmpty();
    req.checkBody('city', 'City field is required').notEmpty();
    req.checkBody('zip', 'Zip Code Required').notEmpty();
    req.checkBody('mobile', 'Mobile No. required').notEmpty();


    //check for errors
    let errors = req.validationErrors();
    if (errors) {
        console.log("Form has errors...........")
        res.render('register', {
            errors: errors,
            name: person.name,
            email: person.email,
            address: person.address,
            city: person.city,
            zip: person.zip,
            mobile: person.mobile
        })
    } else {


        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(person.password, salt, (err, hash) => {
                person.password = hash;

                let q = 'INSERT INTO customers SET ?';
                connection.query(q, person, (err, results) => {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log("User added .........")
                        //Our success message
                        req.flash('success', 'Your are registered and can now log in');
                        console.log(results);
                        //REdiredt after user registeration
                        res.location('/');
                        res.redirect('/');
                    }
                });
            });
        });

    }

});

//Seralize user into session
//customers -> name of out table in DB
passport.serializeUser((user, done) => {
    done(null, user.customerId);
});

passport.deserializeUser((customerId, done) => {
    connection.query(`SELECT * FROM customers WHERE customerId = '${customerId}'`, (err, results) => {
        if (err) return done(err)
        console.log(results)
        done(null, results[0].name);
    });
});



//Sign in by grabbing username and password from the sign in page AND
//finding our  user by the username from the database and then
//Matching it's enctypted password with entered password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    let person = {
        email: req.body.email,
        password: req.body.password
    }

    let q = `SELECT customerId,password FROM customers WHERE email = '${person.email}'`;

    connection.query(q, (err, results) => {
        if (err) return done(err);

        if (!results) {
            return done(null, false, {
                message: 'Incorrect email Id'
            });
        }
        console.log(results);
        bcrypt.compare(person.password, results[0].password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, results[0]);
            } else {
                return done(null, false, {
                    message: 'Incorrect Password'
                });
            }
        });

    });
}));

//Login-POST
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: 'Invalid Username or Password'
    }),
    (req, res) => {
        console.log('Authentication Successful');
        res.redirect('/');
    });

module.exports = router;