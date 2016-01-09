// IMPORTS //
var mongoose = require('mongoose');
var User = require('./User');


// SCHEMA //
var projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String },
    team: [{ type: String }]
});


// METHODS //

/**
 * Find a project if exists; callback error otherwise
 * @param projectId {string} - project identifier
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.getProject = function (projectId, callback) {
    Project.find({ _id: projectId }, function (err, results) {
        if (err) callback('Project not found');
        else if (results.length > 0) {
            callback(null, results[0]);
        } else callback('Project not found');
    });
}

/**
 * Create a new project
 * @param name {string} - project name (required)
 * @param budget {number} - total project budget (required)
 * @param description {string} - description (optional)
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.createProject = function (name, budget, description, callback) {
    if (name.length > 0) {
        if (budget) {
            var project = new Project({
                name: name,
                budget: budget,
                description: description || '',
                team: []
            });
            project.save(function (err) {
                if (err) callback('Error saving project: ' + err);
                else callback(null, project);
            });
        } else callback('Project budget required');
    } else callbac('Project name required')
}

/**
 * Add a user to project's team
 * @param projectId {string} - project identifier
 * @param email {string} - email of team member to be added
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.addTeamMember = function (projectId, email, callback) {
    Project.getProject(projectId, function (err, project) {
        if (err) callback(err)
        else {
            if (project.team.indexOf(email) === -1) { // if not in team
                project.team.push(email); // add to team
                project.save(function (err) {
                    if (err) callback('Error saving project: ' + err);
                    else callback(null, project);
                });
            }
        }
    });
}

/**
 * Remove a user from project's team
 * @param projectId {string} - project identifier
 * @param email {string} - email of team member to be removed
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.removeTeamMember = function (projectId, email, callback) {
    Project.getProject(projectId, function (err, project) {
        if (err) callback(err)
        else {
            if (project.team.indexOf(email) !== -1) { // if in team
                project.team.splice(project.team.indexOf(email), 1); // remove from team
                project.save(function (err) {
                    if (err) callback('Error saving project: ' + err);
                    else callback(null, project);
                });
            }
        }
    });
}


// EXPORTS //
var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
