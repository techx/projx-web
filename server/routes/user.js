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
    User.createUser(req.body.email, req.body.password, req.body.name, req.body.phone, function(err, result) {
        if (err) {
            res.status(403).send(err);
        } else {
            req.session.email = result.email;
            res.status(200).send('User created');
        }
    });
});

/**
 * GET / - Get user object
 * @param req.query.email
 */
router.get('/', middle.auth, function(req, res) {
    res.send(req.query.email)
});

/**
 * POST /login - Try to log in user
 * @param req.body.email
 */
router.post('/login', function(req, res) {
    if (!req.curEmail) {
        User.verifyPassword(req.body.email, req.body.password, function(err, result) {
            if (err) {
                res.status(400).send(err);
            } else if (result) {
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
