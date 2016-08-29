var User = require('../models/User');
var Post = require('../models/Post');
var valid = {};

/**
 * Validate that user with given email exists in database.
 */
valid.userExists = function (email, cb) {
    User.findOne({email: email}, function (err, user) {
        if (err) cb(err);
        else if (user) cb(null, true);
        else cb(null, false);
    });
}

/**
 * Validate that user with given email is an admin.
 */
valid.userIsAdmin = function (email, cb) {
    User.findOne({email: email}, function (err, user) {
        if (err) cb(err);
        else if (user && user.isAdmin) cb(null, true);
        else cb(null, false);
    });
}

/**
 * Validate that post with given id exists in database.
 */
valid.postExists = function (postId, cb) {
    User.findOne({_id: postId}, function (err, post) {
        if (err) cb(err);
        else if (post) cb(null, true);
        else cb(null, false);
    });
}

module.exports = valid;
