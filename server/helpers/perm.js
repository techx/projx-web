var Project = require('../models/Project.js');
var perm = {};

/**
 * Proceed with no conditions.
 */
perm.none = function (req, res, next) {
    next();
}

/**
 * Proceed if user is logged in, redirect to home otherwise.
 */
perm.auth = function (req, res, next) {
    if (req.session.user === undefined) res.status(401).send('Must be logged in');
    else next();
}

/**
 * Proceed if user is logged in and is on given team or an admin.
 * @param {string} req.body.projectId OR req.query.projectId OR req.body.project._id OR req.query.project._id - id of project to be protected
 */
perm.team = function (req, res, next) {
    if (req.session.user === undefined) res.status(401).send('Must be logged in');
    else if (req.session.isAdmin) next();
    else {
        var projectId = req.body.projectId || req.query.projectId || req.body.project._id || req.query.project._id;

        Project.findOne({_id: projectId}, function (err, project) {
            if (err) res.status(500).send(err);
            else {
                if (project.team.indexOf(req.session.email) !== -1) {
                    next();
                } else {
                    res.status(401).send('Must be on requested team');
                }
            }
        })
    }
}

/**
 * Proceed if user is logged in and has given email or an admin.
 * @param {string} req.body.email OR req.query.email OR req.body.user.email OR req.query.user.email - email of user to be protected
 */
perm.user = function (req, res, next) {
    if (req.session.user === undefined) res.status(401).send('Must be logged in');
    else if (req.session.user.isAdmin) next();
    else {
        var email = req.body.email || req.query.email || req.body.user.email || req.query.user.email;
        if (email.toLowerCase() === req.session.user.email) {
            next();
        } else {
            res.status(401).send('Logged in user must match user in request');
        }
    }
}

/**
 * Proceed if user is logged in and is an admin.
 */
perm.admin = function (req, res, next) {
    if (req.session.user === undefined) res.status(401).send('Must be logged in');
    else if (req.session.user.isAdmin) {
        next();
    } else {
        res.status(401).send('Must be admin');
    }
}

module.exports = perm;
