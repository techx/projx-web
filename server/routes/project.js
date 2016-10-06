var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var perm = require('../perm');
var config = require('../../config');
var Slack = require('slack-node');

var slack = new Slack();
slack.setWebhook(config.slackWebhookUri);
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

        //Validate that they don't exceed the funding limits
        var budgetValid = true;
        if (project.private.budgetAmount) {
            var budget = project.private.budgetAmount.toString();;
            budget = parseFloat(budget.replace(/\$/g, ''));
            project.private.budgetAmount = budget;

            if (isNaN(budget)) {
                budgetValid = false;
                res.status(400).send('Budget amount not a number');
            } else if (budget > MAX_FUNDING) {
                budgetValid = false;
                res.status(400).send('Max budget exceeded');
            }
        }
        if (budgetValid) {

            // Hardcode batch
            project.private.batch = "ProjX Fall 2016";
            project.private.status = "pending";

            // Empty defaults for optional fields
            if (!project.private.budgetUsed) {
                project.budgetUsed = 0;
            }
            if (!project.visibility) {
                project.visibility = "team";
            }
            if (!project.public.team) {
                project.public.team = [req.session.email];
            }

            var newProject = new Project({
                name : project.name,
                team: project.team,
                public: project.public,
                private: project.private,
                admin: {comments: undefined}
            });

            newProject.save(function (err) {
                if (err) res.status(500).send('Failed to save project');
                else {
                    var slackText = '*' + newProject.name + '*\n' + newProject.public.projectDescription + '\nhttp://projx.mit.edu/project/' + newProject._id;
                    slack.webhook({
                        channel: '#apps-16fa',
                        username: 'appbot',
                        icon_url: 'http://techx.mit.edu/img/projx.svg',
                        text: slackText
                    }, function(err, response) {
                        if (err) console.log(err);
                    });
                    res.status(201).send('Project created');
                }
            });
        }
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
	    var validatedProject = {
            name: project.name,
            private: project.private,
            public: project.public,
            admin: project.admin
        };

        //Validate that they don't exceed the funding limits
        var budgetValid = true;
        if (validatedProject.private.budgetAmount) {
            var budget = validatedProject.private.budgetAmount.toString();
            budget = parseFloat(budget.replace(/\$/g, ''));
            validatedProject.private.budgetAmount = budget;

            if (isNaN(budget)) {
                budgetValid = false;
                res.status(400).send('Budget amount not a number');
            } else if (budget > MAX_FUNDING) {
                budgetValid = false;
                res.status(400).send('Max budget exceeded');
            }
        }
        if (budgetValid) {
            // If user is not admin, don't allow them to edit budgetUsed, status, or comments
            if (!req.session.isAdmin) {
    	    if (validatedProject.private.budgetUsed) {
                    delete validatedProject.private.budgetUsed;
    	    }
    	    if (validatedProject.private.status) {
                    delete validatedProject.private.status;
    	    }
    	    if (validatedProject.admin) {
    		        delete validatedProject.admin;
    	    }
            }

            Project.findByIdAndUpdate(project._id, validatedProject, {new : true, runValidators: true}, function(err, updatedProject) {
                if (err) res.status(403).send('Project could not be updated');
                else res.status(200).send('Project updated');
            });
        }
    }
});

/**
 * GET /current [auth] Get list of current user's project objects.
 */
router.get('/current', perm.auth, function(req, res) {
    if (!req.session.email) res.status(404).send('No user logged in');
    else {
        Project.find({'public.team' : req.session.email.toLowerCase()}, function (err, projects) {
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
