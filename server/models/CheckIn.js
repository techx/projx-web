var mongoose = require('mongoose');
var Project = require('./Project');
var User = require('./User');

var checkInSchema = mongoose.Schema({
    project: { type: Schema.ObjectId, ref: 'Project', required: true }, // Project for checkin
    admin: { type: String, required: true }, // email of ProjX admin who conducted checkin
    number: { type: Number }, // The number of the checkin

    date: { type: Date, default: Date.now },

    receiptsReceived: [{ type: String }], // For images of receipts TODO 
    progressPics: [{ type: String }], // For images of progress TODO
    progress: { type: String },
    concerns: { type: String}, 
    budgetUsedToDate: { type: Number }, 

});

checkInSchema.statics.validate = function(checkIn, cb) {
    // TODO validation
    // Check that project id is valid
    // Check that admin user is admin
    // Check that list of images point to images that actually exist on the server
    cb(true);
}

module.exports = mongoose.model('CheckIn', checkInSchema);
