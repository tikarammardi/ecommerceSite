let express = require('express');
let router = express.Router();

//Login Page - GET REQUEST
router.get('/login',(req,res)=> {
    res.send('login page');
})


//Register Page - GET REQUEST
router.get('/register',(req,res)=> {
    res.send('register page');
});

module.exports = router;