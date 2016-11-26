var router = require('express').Router();
var CheckIn = require('../models/CheckIn');
var Project = require('../models/Project');
var perm = require('../perm');
var config = require('../../config');


/**
 * POST / [admin] Create a new checkin for a given project. Sets current user as admin contact for this checkin
 */
router.post('/', perm.admin, function(req, res) {
    if (!req.body.checkIn.project) res.status(400).send('No project given');
    else {
        var checkIn = req.body.checkIn;

        // Make sure the project being referenced exists
        // Also make sure the checkIn is saved with the right number
        Project.find({ _id: checkIn.project }, function (err, results) {
            if (err || results.length === 0) res.status(404).send('Invalid project');
            else CheckIn.count({ project: checkIn.project }, function (err, count) {
                console.log(count);
                checkIn.project = results[0]._id;
                checkIn.admin = req.session.email;
                checkIn.number = count + 1;

                if (isNaN(checkIn.budgetUsedToDate)) {
                    res.status(400).send('Budget used to date not a number');
                    return;
                } 

                // TODO handle image uploads

                var newCheckIn = new CheckIn({
                    project: checkIn.project,
                    admin: checkIn.admin,
                    budgetUsedToDate: checkIn.budgetUsedToDate,
                    progress: checkIn.progress,
                    concerns: checkIn.concerns,
                    number: checkIn.number
                });

                newCheckIn.save(function(err) {
                    if (err) res.status(500).send('Failed to save checkin');
                    else res.status(201).send('Checkin saved!');
                });
            });
        });
    }
});


/**
 * GET / [admin] Get a checkin
 * @param {string} req.query.checkInId - id of desired checkin
 */
router.get('/', perm.admin, function(req, res) {
    CheckIn.find({ _id: req.query.checkInId })
    .populate('project').exec(function(err, results) {
        if (err || results.length == 0) res.status(404).send('Checkin not found');
        else res.status(200).send(results[0]);
    });
});


/**
 * GET /project [admin] Get list of all checkins for a project, sorted by date
 * Returns object { project: project, checkIns: [checkIn] }
 * @param {string} req.query.projectId - id of desired project
 */
router.get('/project', perm.admin, function(req, res) {
    Project.find({ _id: req.query.projectId }, function(err, projects) {
        if (err || projects.length == 0) res.status(404).send('Invalid project id');    
        else CheckIn.find({ project: req.query.projectId }).sort('date').exec(function(err, results) {
            if (err) res.status(500).send('Unable to retrieve checkins');
            else res.status(200).send({
                project: projects[0],
                checkIns: results
            });
        });
    });
});


/**
 * POST /update [admin] Update a checkin
 * @param {object} req.body.checkIn checkin object
 */
router.post('/update', perm.admin, function(req, res) {
    if (!req.body.checkIn || ! req.body.checkIn._id) res.status(400).send('Invalid update');
    else {
        var newCheckIn = req.body.checkIn;
        CheckIn.findOne({ _id: newCheckIn._id }, function (err, checkIn) {
            if (err) res.status(404).send('Checkin not found');
            else {
                // Note that we never update the project id that the checkin references
                checkIn.admin = req.session.email;
                
                // TODO handle updating the list of pictures.
                // Probably best for this route to only handle adding more images
                // Seperate deletion endpoint for deletinge existing images
                
                checkIn.progress = newCheckIn.progress;
                checkIn.concerns = newCheckIn.concerns;
                if (isNaN(newCheckIn.budgetUsedToDate)) {
                    res.status(400).send('Budget used to date not a number');
                    return;
                } 
                checkIn.budgedUsedToDate = newCheckIn.budgetUsedToDate;
                
                checkIn.save(function(err, updatedCheckIn) {
                    if (err) res.status(500).send('Failed to save checkin');
                    else res.status(200).send('Checkin updated');
                });
            }
        });
    }
});

module.exports = router;
