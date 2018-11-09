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


    connection.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;

        res.render('product', {
            results
        });
    });



});

module.exports = router;