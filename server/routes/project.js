// IMPORTS //
var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var middle = require('../middle');


// ROUTES //

/**
 * POST / - [auth] Create new project and add current user to team
 * @param req.body.project {object} - new project object (name field required)
 */
router.post('/', middle.auth, function(req, res) {
    if (!req.body.project.name) res.status(400).send('Name missing')
    else {
        Project.createProject(req.body.project, function(err, project) {
            if (err) res.status(403).send(err);
            else res.status(200).send('Project created');
        });
    }
});

/**
 * GET / - [team] Get project object
 * @param req.query.projectId {string} - id of desired project
 */
router.get('/', middle.team, function(req, res) {
    Project.getProject(req.query.projectId, function (err, project) {
        if (err) res.status(403).send(err);
        else res.status(200).send(project);
    });
});

/**
 * GET /current - Get list of current user's project objects
 */
router.get('/current', middle.auth, function(req, res) {
    if (!req.session.email) res.status(404).send('No user logged in');
    else {
        Project.getProjectsByMember(req.session.email, function (err, projects) {
            if (err) res.status(403).send(err);
            else res.status(200).send(projects);
        });
    }
});

/**
 * GET /all - Get list of all project objects
 */
router.get('/all', middle.admin, function(req, res) {
    Project.getAllProjects(function (err, projects) {
        if (err) res.status(403).send(err);
        else res.status(200).send(projects);
    });
});

/**
 * POST /team/add - [team] Add a user to the team
 * @param req.body.projectId - id of project
 * @param req.body.email - email of user to be added
 */
router.post('/team/add', middle.team, function(req, res) {
    Project.addTeamMember(req.body.projectId, req.body.email, function (err, result) {
        if (err) res.status(403).send(err);
        else res.status(200).send('Team member added');
    });
});

/**
 * POST /team/remove - [team] Remove a user from the team
 * @param req.body.projectId - id of project
 * @param req.body.email - email of user to be removed
 */
router.post('/team/remove', middle.team, function(req, res) {
    Project.removeTeamMember(req.body.projectId, req.body.email, function (err, result) {
        if (err) res.status(403).send(err);
        else res.status(200).send('Team member removed');
    });
});


// EXPORTS //
module.exports = router;
