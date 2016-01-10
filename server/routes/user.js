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
 * GET /current [auth] - Get current user object
 */
router.get('/current', middle.auth, function(req, res) {
    User.getUser(req.session.email, function (err, user) {
        if (err) res.status(403).send(err);
        else res.status(200).send(user);
    });
});

/**
 * POST /login - Try to log in user
 * @param req.body.email - user email (required)
 * @param req.body.password - user password (required)
 */
router.post('/login', function(req, res) {
    if (req.session.email) {
        res.status(403).send('There is a user already logged in')
    } else {
        if (!req.body.email) res.status(400).send('Email missing');
        if (!req.body.password) res.status(400).send('Password missing');

        User.verifyPassword(req.body.email, req.body.password, function(err, result) {
            if (err) res.status(403).send('Incorrect username/password');
            else if (result) {
                // password verified

                // email on req
                req.session.email = req.body.email.toLowerCase();

                // admin status on req
                User.getUser(req.session.email, function (err, user) {
                    if (err) res.status(403).send('Incorrect username/password');
                    else if (user.isAdmin) {
                        req.session.isAdmin = true;
                        res.status(200).send('Login successful');
                    } else {
                        req.session.isAdmin = false;
                        res.status(200).send('Login successful');
                    }
                });
            } else {
                // password failed
                res.status(403).send('Incorrect username/password');
            }
        });
    }
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
