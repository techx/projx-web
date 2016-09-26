var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var perm = require('../helpers/perm');

// Max funding amount for this semester
var MAX_FUNDING = 500;

/**
 * POST / [auth] Create new project and add current user to team.
 * @param {object} req.body.project new project object (name field required)
 */
router.post('/', perm.auth, function(req, res) {
    if (!req.body.project.name) res.status(400).send('Project name missing');
    else {
        var project = req.body.project;
        
        // Check that max funding is not exceeded
        if (project.budgetAmount > MAX_AMOUNT) {
            res.status(400).send('Max funding exceeded');
        }

        // Hardcode batch
        project.infoTeam.batch = "ProjX Fall 2016";
        project.infoTeam.status = "pending";

        // Empty defaults for optional fields
        if (!project.budgetUsed) {
            project.budgetUsed = 0;
        }
        if (!project.visibility) {
            project.visibility = "team";
        }
        if (!project.team) {
            project.team = [req.session.user.email];
        }

        var newProject = new Project({
            name : project.name,
            team: project.team,
            infoPublic: project.infoPublic,
            infoTeam: project.infoTeam,
            infoAdmin: {comments: undefined}        
        });
    
            newProject.save(function (err) {
                if (err) res.status(500).send('Failed to save project');
                else res.status(201).send('Project created');
        }); 
    }
});

/**
 * GET / [team] Get project object.
 * @param {string} req.query.projectId - id of desired project
 */
router.get('/', perm.team, function(req, res) { 

    Project.find({ _id: req.query.projectId }, function (err, results) {
    if (err) res.status(404).send('Project not found');
    else if (results.length > 0) {
        res.status(200).send(results[0]);
    } else res.status(404).send('Project not found');
    });
});

/**
 * POST /update [team] Update a project.
 * @param {object} req.body.project - project object
 */
router.post('/update', perm.team, function(req, res) {
    if (!req.body.project ||
        !req.body.project.name ||
        !req.body.project._id) res.status(400).send('Invalid update');
    else {
        var project = req.body.project;
        //Validate that they don't exceed the funding limits
        if (project.budgetAmount > MAX_AMOUNT) {
            res.status(400).send('Max funding exceeded');
        }

        // If user is not admin, don't allow them to edit budgetUsed, status, or comments
        if (!req.session.user.isAdmin) {
            delete project.infoTeam.budgetUsed;
            delete project.infoTeam.status;
            delete project.infoAdmin;
        }

        Project.findByIdAndUpdate(project._id, project,{new : true, runValidators: true}, function(err, updatedProject) {
            if (err) res.status(403).send('Project could not be updated');
            else res.status(200).send('Project updated');
            }); 
    }
});

/**
 * GET /current [auth] Get list of current user's project objects.
 */
router.get('/current', perm.auth, function(req, res) {
    // TODO

    if (!req.session.email) res.status(404).send('No user logged in');
    else {
        Project.find({team : req.session.email.toLowerCase()}, function (err, projects) {
            if (err) res.status(403).send(err);
            else res.status(200).send(projects);
        });
}

});

/**
 * GET /all [admin] Get list of all project objects
 */
router.get('/all', perm.admin, function(req, res) {
    Project.find({}, function(err, projects) {
        if (err) res.status(403).send(err);
        else res.status(200).send(projects);
    });
});

module.exports = router;
