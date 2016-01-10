// IMPORTS //
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


// SCHEMA //
var userSchema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true, index: { unique: true } }, // unique identifier
    password: { type: String, required: true },
    name: { type: String },
    phone: { type: String },
    isAdmin: { type: Boolean }
});


// METHODS //

/**
 * Find a user if exists; callback error otherwise
 * @param email {string} - email of a potential user
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getUser = function(email, callback) {
    if (!email) callback('Email missing');

    var lowerEmail = email.toLowerCase();
    User.find({ email: lowerEmail }, function(err, results) {
        if (err) callback('User not found');
        else if (results.length > 0) {
            callback(null, results[0]);
        } else callback('User not found');
    });
}

/**
 * Authenticate a user
 * @param email {string} - email of user to check
 * @param password {string} - password to check
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.verifyPassword = function (email, password, callback) {
    User.getUser(email, function (err, result) {
        if (err) callback(err);
        else if (bcrypt.compareSync(password, result.password)) {
            callback(null, true);
        } else callback(null, false);
    });
}

/**
 * Create a new user
 * @param email {string} - email, must be an MIT email
 * @param password {string} - password
 * @param name {string} - name
 * @param phone {string} - phone
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.createUser = function (email, password, name, phone, callback) {
    var lowerEmail = email.toLowerCase();
    if (lowerEmail.match('^[a-z0-9_-]+@mit.edu$')) {
        if (password.length >= 6) {
            User.find({ email: lowerEmail }, function (err, results) {
                if (err) callback(err);
                else if (results.length === 0) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    var user = new User({
                        email: lowerEmail,
                        password: hash,
                        name: name || '',
                        phone: phone || '',
                        isAdmin: false
                    });
                    user.save(function (err) {
                        if (err) callback('Error saving user: ' + err);
                        else callback(null, user);
                    });
                } else callback('User already exists');
            });
        } else callback('Password must be at least 6 characters long');
    } else callback('Must be @mit.edu email address');
}


// EXPORTS //
var User = mongoose.model('User', userSchema);
module.exports = User;
