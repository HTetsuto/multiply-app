var express = require('express');
var router = express.Router();

/* GET form page. */
router.get('/', function(req, res, next) {
    res.render('layouts/main', {
            title: 'Form',
            body: 'form'
        }
    );
});

module.exports = router;