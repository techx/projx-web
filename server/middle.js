// IMPORTS //
var User = require('./models/User.js');
var Project = require('./models/Project.js');


// MIDDLEWARE FUNCTIONS //
var middle = {};

/**
 * mount current user email on req.curEmail and admin status on req.curAdmin (if logged in)
 */
middle.mountUser = function (req, res, next) {
    if (req.session.email) {
        req.curEmail = req.session.email;
        User.getUser(req.session.email, function (err, user) {
            if (err) next();
            else if (user.isAdmin) {
                req.curAdmin = true;
                next();
            } else {
                req.curAdmin = false;
                next();
            }
        });
    } else {
        next();
    }
}

/**
 * proceed if user is logged in, redirect to home otherwise
 */
middle.auth = function (req, res, next) {
    if (req.curEmail) {
        next();
    } else {
        res.redirect('/');
    }
}

/**
 * proceed if user is logged in and is on given team or an admin, redirect to home otherwise
 * @param req.body.projectId OR req.query.projectId {string} - id of project to be protected
 */
middle.team = function (req, res, next) {
    if (req.curAdmin) next();
    else {
        var projectId = req.body.projectId || req.query.projectId;
        if (projectId && req.curEmail) {
            Project.getProject(projectId, function (err, project) {
                if (err) res.redirect('/');
                else if (project.team.indexOf(req.curEmail) !== -1) {
                    next();
                } else {
                    res.redirect('/');
                }
            })
        } else {
            res.redirect('/');
        }
    }
}

/**
 * proceed if user is logged in and has given email or an admin, redirect to home otherwise
 * @param req.body.email OR req.query.email {string} - email of user to be protected
 */
middle.user = function (req, res, next) {
    if (req.curAdmin) next();
    else {
        var email = req.body.email || req.query.email;

        if (email && req.curEmail) {
            if (email.toLowerCase() === req.curEmail.toLowerCase()) {
                next();
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }
}

/**
 * proceed if user is logged in and is an admin, redirect to home otherwise
 */
middle.admin = function (req, res, next) {
    if (req.curEmail) {
        User.getUser(req.curEmail, function (err, user) {
            if (err) res.redirect('/');
            else if (user.isAdmin) {
                next();
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
}


// EXPORTS //
module.exports = middle;
