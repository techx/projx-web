var router = require('express').Router();
var User = require('../models/User');
var perm = require('../helpers/perm');
var config = require('../../config');
var randomstring = require('randomstring');
var sha256 = require('sha256');

/**
 * GET / [user] Get user object by email.
 * @param {string} req.query.email - user email (required)
 */
router.get('/', perm.auth, function(req, res) {
    // TODO
});

/**
 * GET /current [auth] Get current user object.
 */
router.get('/current', perm.auth, function(req, res) {
    // TODO
});

/**
 * POST /assignkey [none] Assign a random key to current session and return it.
 */
router.post('/assignkey', perm.none, function(req, res) {
    // TODO
});

/**
 * GET /login [none] Try to log in user.
 * @param {string} req.query.email - user's email
 * @param {strig} req.query.token - user's token from cert auth site
 * @param {string} req.query.name - user's name
 */
router.get('/login', perm.none, function(req, res) {
    // TODO
});

/**
 * POST /logout [auth] Log out any current user.
 */
router.post('/logout', perm.auth, function(req, res) {
    // TODO
});

/**
 * POST /update [user] Update a user.
 * @param {object} req.body.user - user's object
 */
router.post('/update', perm.user, function(req, res) {
    // TODO
});

module.exports = router;
