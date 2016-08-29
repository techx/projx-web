var router = require('express').Router();
var Project = require('../models/Project');
var User = require('../models/User');
var perm = require('../helpers/perm');

/**
 * POST / [auth] Create new project and add current user to team.
 * @param {object} req.body.project new project object (name field required)
 */
router.post('/', perm.auth, function(req, res) {
    // TODO
});

/**
 * GET / [team] Get project object.
 * @param {string} req.query.projectId - id of desired project
 */
router.get('/', perm.team, function(req, res) {
    // TODO
});

/**
 * POST /update [team] Update a project.
 * @param {object} req.body.project - project object
 */
router.post('/update', perm.team, function(req, res) {
    // TODO
});

/**
 * GET /current [auth] Get list of current user's project objects.
 */
router.get('/current', perm.auth, function(req, res) {
    // TODO
});

/**
 * GET /all [admin] Get list of all project objects
 */
router.get('/all', perm.admin, function(req, res) {
    // TODO
});

module.exports = router;
