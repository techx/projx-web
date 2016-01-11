// IMPORTS //
var router = require('express').Router();
var User = require('../models/User');
var middle = require('../middle');


// ROUTES //

/**
 * POST / - Create new user
 * @param req.body.user {string} - user object (requires password and unique email)
 */
router.post('/', function(req, res) {
    if (!req.body.user.email) res.status(400).send('Email missing');
    if (!req.body.user.password) res.status(400).send('Password missing');

    User.createUser(req.body.user, function(err, result) {
        if (err) res.status(403).send(err);
        else {
            req.session.email = result.email;
            req.session.isAdmin = result.email;
            res.status(200).send('User created');
        }
    });
});

/**
 * GET / [user] - Get user object, return if current user matches or is admin
 * @param req.query.email - user email (required)
 */
router.get('/', middle.user, function(req, res) {
    if (!req.query.email) res.status(400).send('Email missing');

    User.getUser(req.query.email, function (err, user) {
        if (err) res.status(403).send(err);
        else res.status(200).send(user);
    });
});

/**
 * GET /current - Get current user object
 */
router.get('/current', function(req, res) {
    if (!req.session.email) res.status(404).send('No user logged in');
    else {
        User.getUser(req.session.email, function (err, user) {
            if (err) res.status(403).send(err);
            else res.status(200).send(user);
        });
    }
});

/**
 * GET /login - Try to log in user
 * @param req.query.email - user's email
 * @param req.query.token - user's token from cert auth site
 * @param req.query.name - user's name
 */
router.get('/login', function(req, res) {
    var email = req.query.email.toLowerCase();
    var token = req.query.token;
    var name = req.query.name;

    // lol
    res.send(req.query);

    // what if user already logged in
    // what if info is missing
    // what if token is wrong

    // User.getUser(email, function (err, user) {
    //     if (err) {
    //         // user does not exist, create new
    //     } else if (user.isAdmin) {
    //         // email on req
    //         req.session.email = req.body.email.toLowerCase();
    //         req.session.isAdmin = true;
    //         res.redirect('/');
    //     } else {
    //         req.session.isAdmin = false;
    //         res.redirect('/');
    //     }
    // });
});

/**
 * POST /logout - Log out any current user
 */
router.post('/logout', function(req, res) {
    if (req.session.email) {
        req.session = null;
        res.status(200).send('Log out successful');
    } else {
        res.status(400).send('There is no user currently logged in');
    }
});


// EXPORTS //
module.exports = router;
