const express = require('express');
const router = express.Router();

//Login Page - GET REQUEST
router.get('/login', (req, res) => {
    res.render('login');
})


//Register Page - GET REQUEST
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have Logged Out')
    res.redirect('/users/login');

});



module.exports = router;