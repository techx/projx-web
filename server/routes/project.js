// IMPORTS //
var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var perm = require('../helpers/perm');


// ROUTES //

/**
 * POST / - [auth] Create new project and add current user to team
 * @param req.body.project {object} - new project object (name field required)
 */
router.post('/', perm.auth, function(req, res) {
    if (!req.body.project.name) res.status(400).send('Project name missing')
    else {
        var project = req.body.project;

        // create empty categories
        if (!project.infoPublic) {
            project.infoPublic = {};
        }
        if (!project.infoTeam) {
            project.infoTeam = {};
        }
        if (!project.infoAdmin) {
            project.infoAdmin = {};
        }

        // hard code current batch
        project.infoTeam.batch = 'ProjX Summer 16';
        project.infoTeam.status = 'pending';

        // budget checking
        if (project.infoTeam.budgetAmount) {
            if (isNaN(project.infoTeam.budgetAmount)) {
                res.status(403).send('Budget amount must be a number');
                return;
            } else if (project.infoTeam.budgetAmount > 250) {
                res.status(403).send('Budget amount must at most $250');
                return;
            }
        }

        Project.createProject(project, function(err, newProject) {
            if (err) res.status(403).send(err);
            else res.status(200).send('Project created');
        });
    }
});

/**
 * GET / - [team] Get project object
 * @param req.query.projectId {string} - id of desired project
 */
router.get('/', perm.team, function(req, res) {
    Project.getProject(req.query.projectId, function (err, project) {
        if (err) res.status(403).send(err);
        else res.status(200).send(project);
    });
});

/**
 * GET /current - Get list of current user's project objects
 */
router.get('/current', perm.auth, function(req, res) {
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
router.get('/all', perm.admin, function(req, res) {
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
router.post('/team/add', perm.team, function(req, res) {
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
router.post('/team/remove', perm.team, function(req, res) {
    Project.removeTeamMember(req.body.projectId, req.body.email, function (err, result) {
        if (err) res.status(403).send(err);
        else res.status(200).send('Team member removed');
    });
});

/**
 * POST /update - [admin] Update a project
 * @param req.body.project - project object
 */
router.post('/update', perm.team, function(req, res) {
    if (!req.body.project.name) res.status(400).send('Project name missing')
    else {

        // budget checking
        if (req.body.project.infoTeam.budgetAmount) {

            // remove dollar signs and commas
            req.body.project.infoTeam.budgetAmount = req.body.project.infoTeam.budgetAmount.toString().replace(/\$|,/g, '');

            if (isNaN(req.body.project.infoTeam.budgetAmount)) {
                res.status(403).send('Budget amount must be a number');
                return;
            } else if (req.body.project.infoTeam.budgetAmount > 250) {
                res.status(403).send('Budget amount must be at most $250');
                return;
            }
        }

        Project.updateProject(req.body.project, function (err, result) {
            if (err) res.status(403).send(err);
            else res.status(200).send('Project updated');
        });
    }
});


// EXPORTS //
module.exports = router;
