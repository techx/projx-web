// IMPORTS //
var router = require('express').Router();
var path = require('path');

// ROUTES //
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/views/splash.html'));
});

router.get('/apply', function(req, res, next) {
    res.redirect('https://goo.gl/forms/pLRx91dFLuoOOywM2');
});

router.get('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/views/index.html'));
});

module.exports = router;
