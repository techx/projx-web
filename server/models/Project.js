// IMPORTS //
var mongoose = require('mongoose');
var User = require('./User');


// SCHEMA //
var projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    team: [{ type: String }], // list of valid emails
    primary: { type: String }, // valid email; primary contact, should be on team
    point: { type: String }, // valid emai; point person on committee, should be admin
    granted: { type: Number },
    used: { type: Number },
    pitch: { type: String },
    details: { type: String },
    budget: { type: String },
    timeline: { type: String },
    legalese: { type: String },
    other: { typer: String }
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
 * Find a list of projects with given email as team member
 * @param email {string} - member's email
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.getProjectsByMember = function (email, callback) {
    Project.find({ team: email.toLowerCase() }, function (err, results) {
        if (err) callback(err);
        else callback(null, results);
    });
}

/**
 * Get all project objects
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.getAllProjects = function (callback) {
    Project.find({}, function (err, results) {
        if (err) callback(err);
        else callback(null, results);
    });
}

/**
 * Create a new project
 * @param project {object} - new project object (name field required)
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.createProject = function (project, callback) {
    if (project.name) {
        var newProject = new Project(project);
        newProject.save(function (err) {
            if (err) callback('Error saving project: ' + err);
            else callback(null, newProject);
        });
    } else callback('Project name required')
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
        if (err) callback(err);
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

/**
 * Update given project
 * @param project {object} - new project object (with _id as identifier)
 * @param callback {function} - function to be called with err and result
 */
projectSchema.statics.updateProject = function (project, callback) {
    Project.getProject(project._id, function (err, oldProject) {
        if (err) callback(err);
        else {
            for (field in Project.schema.paths) {
                oldProject[field] = project[field];
            };
            oldProject.save(function (err) {
                if (err) callback('Error saving project: ' + err);
                else callback(null, oldProject);
            });
        }
    })
}


// EXPORTS //
var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
