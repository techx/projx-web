// IMPORTS //
var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var middle = require('../middle');


// ROUTES //

/**
 * POST / - [auth] Create new project and add current user to team
 * @param req.body.name {string} - name of a new project (required)
 * @param req.body.budget {number} - budget (required)
 * @param req.body.description {string} - description (optional)
 */
router.post('/', middle.auth, function(req, res) {
    if (!req.body.name) res.status(400).send('Name missing');
    if (!req.body.budget) res.status(400).send('Budget missing');

    Project.createProject(req.body.name, req.body.budget, req.body.description, function(err, project) {
        if (err) res.status(403).send(err);
        else {
            Project.addTeamMember(project._id, req.curEmail, function (err, result) {
                if (err) res.status(403).send(err);
                else res.status(200).send('Project created');
            });
        }
    });
});

/**
 * GET / - [team] Get project object
 * @param req.query.projectId {string} - id of desired project
 */
router.get('/', middle.team, function(req, res) {
    Project.getProject(req.query.projectId, function (err, project) {
        if (err) res.status(403).send(err);
        else {
            res.status(200).send(project);
        }
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
        else {
            res.status(200).send('Team member added');
        }
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
        else {
            res.status(200).send('Team member removed');
        }
    });
});


// EXPORTS //
module.exports = router;
