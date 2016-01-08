// IMPORTS //
var middle = {};


// MIDDLEWARE FUNCTIONS //

// mount current user email on req.curEmail (if logged in)
middle.mountEmail = function (req, res, next) {
    if (req.session.email) {
        req.curEmail = req.session.email;
        next();
    } else {
        next();
    }
}

// proceed if user is logged in, redirect to home otherwise
middle.auth = function (req, res, next) {
    if (req.curEmail) {
        next();
    } else {
        res.redirect('/');
    }
}


// EXPORTS //
module.exports = middle;
