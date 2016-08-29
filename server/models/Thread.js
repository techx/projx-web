var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var threadSchema = mongoose.Schema({
    title: { type: String, required: true },
    posts: [{ type: ObjectId, ref: 'Post'}]
});

threadSchema.statics.validate = function (thread, cb) {
    // TODO: check that each post in posts exists
    cb(true);
}

module.exports = mongoose.model('Thread', threadSchema);
