let express = require('express');
let router = express.Router();

router.get('/',(req,res)=> {
    res.send('index page hello ');
});



module.exports = router;