var router = require('express').Router();
var User = require('../models/User');
var perm = require('../helpers/perm');
var error = require('../helpers/error');
var config = require('../../config');
var randomstring = require('randomstring');
var sha256 = require('sha256');

/**
 * GET / [user] Get user object by email.
 * @param {string} req.query.email - user email (required)
 */
router.get('/', perm.auth, function(req, res) {
    User.findOne({email: req.query.email}, function (err, user) {
        if (err) error.internal(err, res);
        else res.send(user);
    });
});

/**
 * GET /current [none] Get current user object.
 */
router.get('/current', function(req, res) {
    if (req.session.user === undefined) res.send(null);
    else {
        User.findOne({email: req.session.user.email}, function (err, user) {
            if (err) error.internal(err, res);
            else res.send(user);
        });
    }
});

/**
 * POST /loginurl [none] Assign a random key to current session and return login URL.
 */
router.post('/loginurl', perm.none, function(req, res) {
    var key = randomstring.generate(10);
    var url = 'https://' + config.scriptsUsername + '.scripts.mit.edu:444' + config.scriptsPath + '/auth.php';;
    req.session.key = key;
    res.send(url + '?key=' + key);
});

/**
 * GET /login [none] Try to log in user.
 * @param {string} req.query.email - user's email
 * @param {strig} req.query.token - user's token from cert auth site
 * @param {string} req.query.name - user's name
 */
// TODO: Make this a POST.
router.get('/login', perm.none, function(req, res) {
    if (req.session.key === undefined) res.status(400).send('Login process not yet started');

    // get query params
    var email = req.query.email.toLowerCase();
    var token = req.query.token;
    var name = req.query.name;

    // compute token
    var key = req.session.key;
    var secret = config.authSecret;
    var correctToken = sha256(email + key + secret);

    if (token === correctToken) {
        User.findOne({email: email}, function (err, user) {
            if (err) error.internal(err, res);
            else if (user) {
                req.session.key = null;
                req.session.user = {
                    'email': user.email,
                    'isAdmin': user.isAdmin
                }
                res.redirect('/');
            } else {
                var newUser = new User({
                    'email': email,
                    'name': name
                });
                newUser.save(function (err) {
                    if (err) error.internal(err);
                    else res.send('Login successful.');
                });
            }
        });
    } else {
        res.send('Login failed. Requires valid MIT certificate.');
    }
});

/**
 * POST /logout [auth] Log out any current user.
 */
router.post('/logout', perm.auth, function(req, res) {
    req.session = null;
    res.send('Logged out');
});

/**
 * POST /update [user] Update a user. Only supports one level of nesting (e.g. user.info.field is supported but user.info.field.nested is not).
 * @param {object} req.body.user - user's object
 */
router.post('/update', perm.user, function(req, res) {
    var newUser = req.body.user;
    User.findOne({email: newUser.email}, function (err, user) {
        if (err) error.internal(err, res);
        else {
            for (field in User.schema.paths) {
                user[field.split(".")[0]] = newUser[field.split(".")[0]];
            };
            user.save(function (err) {
                if (err) error.internal(err, res);
                else res.send(user);
            });
        }
    });
});

module.exports = router;
