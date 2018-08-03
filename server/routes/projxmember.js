// IMPORTS //
var router = require('express').Router();
var Projxmember = require('../models/Projxmember');
var perm = require('../perm');
var config = require('../../config');
var randomstring = require('randomstring');
var sha256 = require('sha256');


// ROUTES //


/**
 * GET /getProjxmembers [admin] Get list of all projxmembers
 */
router.get('/getProjxmembers', perm.admin, function(req, res) {
    Projxmember.find({}, function(err, projxmembers) {
        if (err) {
            res.status(403).send(err);
        } else {
            res.status(200).send(projxmembers);
        };
    });
});


/**
 * POST /update - [admin] Update a projxmember
 * @param req.body.projxmember - projxmember object
 */
router.post('/updateProjxmember', function(req, res) {
    Projxmember.updateProjxmember(req.body.projxmember, function (err, result) {
        if (err) res.status(403).send(err);
        else res.status(200).send('projxmember updated');
    });
});

// EXPORTS //
module.exports = router;
