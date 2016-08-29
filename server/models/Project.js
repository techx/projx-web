var mongoose = require('mongoose');
var User = require('./User');

var projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    team: [{ type: String }], // list of valid emails
    teamDescription: { type: String },
    projectPitch: { type: String },
    projectDescription: { type: String },
    infoTeam: {
        primary: { type: String }, // valid email, should be on team
        budgetAmount: { type: Number },
        budgetUsed: { type: Number },
        budgetBreakdown: { type: String },
        otherFunding: { type: String },
        timeline: { type: String },
        point: { type: String }, // valid email, should be admin
        batch: { type: String },
        status: { type: String }
    },
    infoAdmin: {
        comments: { type: String }
    }
});

projectSchema.statics.validate = function (project, cb) {
    // TODO
    cb(true);
}

module.exports = mongoose.model('Project', projectSchema);
