// IMPORTS //
var router = require('express').Router();
var User = require('../models/User');
var middle = require('../middle');


// ROUTES //

/**
 * POST / - Create new user
 * @param req.body.email {string} - email of a potential user (required, must be unique)
 * @param req.body.password {string} - password (required)
 * @param req.body.name {string} - name (optional)
 * @param req.body.phone {string} - phone number (optional)
 */
router.post('/', function(req, res) {
    if (!req.body.email) res.status(400).send('Email missing');
    if (!req.body.password) res.status(400).send('Password missing');

    User.createUser(req.body.email, req.body.password, req.body.name, req.body.phone, function(err, result) {
        if (err) res.status(403).send(err);
        else {
            req.session.email = result.email;
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
        else if ((req.curAdmin) || (req.curEmail.toLowerCase() === user.email)) {
            res.status(200).send(user);
        } else {
            res.redirect('/');
        }
    });
});

/**
 * POST /login - Try to log in user
 * @param req.body.email - user email (required)
 * @param req.body.password - user password (required)
 */
router.post('/login', function(req, res) {
    if (!req.curEmail) {
        if (!req.body.email) res.status(400).send('Email missing');
        if (!req.body.password) res.status(400).send('Password missing');

        User.verifyPassword(req.body.email, req.body.password, function(err, result) {
            if (err) res.status(403).send(err);
            else if (result) {
                // password verified
                req.session.email = req.body.email;
                res.status(200).send('Login successful');
            } else {
                // password failed
                res.status(403).send('Incorrect password');
            }
        });
    } else {
        res.send('There is a user already logged in')
    }
});

/**
 * POST /logout - Log out any current user
 */
router.post('/logout', function(req, res) {
    if (req.curEmail) {
        var email = req.curEmail;
        req.session = null;
        res.status(200).send('Log out successful');
    } else {
        res.status(400).send('There is no user currently logged in');
    }
});


// EXPORTS //
module.exports = router;
