// IMPORTS //
var mongoose = require('mongoose');


// SCHEMA //
var threadSchema = mongoose.Schema({
    title: { type: String, required: true },
    posts: [{ type: String }]
});
