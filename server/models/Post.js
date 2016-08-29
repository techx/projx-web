var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    author: { type: String },
    date: { type: Date },
    content: { type: String }
});

postSchema.statics.validate = function (post, cb) {
    cb(true);
}

module.exports = mongoose.model('Post', postSchema);
