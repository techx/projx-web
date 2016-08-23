// IMPORTS //
var mongoose = require('mongoose');


// SCHEMA //
var postSchema = mongoose.Schema({
    author: { type: String },
    date: { type: Date },
    content: { type: String }
});
