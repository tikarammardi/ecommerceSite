const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const {
    ensureAuthenticated
} = require('../helpers/auth');


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/product', (req, res) => {


    connection.query('SELECT * FROM product', (err, results) => {
        if (err) throw err;


        console.log(results);

        res.render('product', {
            results
        });
    });



});

module.exports = router;