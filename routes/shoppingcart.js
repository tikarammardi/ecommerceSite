const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../config/database');
const {
    ensureAuthenticated
} = require('../helpers/auth');



//GET REQ
router.get('/shoppingcart', (req, res) => {
    console.log(req.user)
    res.render('shoppingcart');

});

//GET REQ with product id
router.get('/add/shoppingcart/:id', (req, res) => {
    let pId = req.params.id;

    //let q1 = `SELECT * FROM customers WHERE name = '${req.user}'`
    if (req.user === undefined) {
        req.flash('error', 'You Need to sign in First');

        res.redirect('/users/login');
    } else {

        connection.query(`SELECT * FROM customers WHERE name = '${req.user}'`, (err, results) => {
            if (err) throw err;
            let q = `INSERT INTO shopping_cart(customer_id,product_id) VALUES (?,?)`;
            connection.query(q, [results[0].customer_id, pId], (err, results) => {
                if (err) throw err;
                console.log("Product added");
                req.flash('success', 'Item added to your cart!')
                res.redirect('/product')
            });

        });

    }

});

router.get('/delete/shoppingcart', (req, res) => {
    res.render('shoppingcart');
});

//POST REQ
router.post('/delete/shoppingcart', (req, res) => {
    res.render('shoppingcart');
});

router.get('/edit/shoppingcart', (req, res) => {
    res.render('shoppingcart');
});

//POST REQ
router.post('/edit/shoppingcart', (req, res) => {
    res.render('shoppingcart');
});

module.exports = router;