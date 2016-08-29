var valid = {};

// Validate that user with given email exists in database.
valid.userExists = function (email, cb) {
    // TODO
    cb(true);
}

// Validate that user with given email is an admin.
valid.userIsAdmin = function (email, cb) {
    // TODO
    cb(true);
}

// Validate that post with given id exists in database.
valid.postExists = function (postId, cb) {
    // TODO
    cb(true);
}

module.exports = valid;
