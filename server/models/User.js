var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true, index: { unique: true } }, // unique identifier
    isAdmin: { type: Boolean, required: true },
    name: { type: String },
    course: { type: String },
    year: { type: String },
    bio: { type: String }
});

userSchema.statics.validate = function (user, cb) {
    try {
        cb(user.email.endsWith('@mit.edu'));
    } catch(err) {
        cb(false);
    }
}

module.exports = mongoose.model('User', userSchema);
