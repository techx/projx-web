// PACKAGES //
var router = require('express').Router();
var path = require('path');

// VIEW ENDPOINTS //
router.get('/', function(req, res, next) {
    res.send('hi');
    // res.sendFile(path.join(__dirname, '../../client/views/index.html'));
});

module.exports = router;
