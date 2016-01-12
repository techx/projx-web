angular.module('portal').controller('adminController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'admin';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'primary': 'primary',
        'point': 'point',
        'funding': 'fundingDisplay'
    };

    // get all projects
    $http.get('/api/project/all').then(function (response) {
        $scope.projects = response.data;
        $scope.projects.forEach(function (project) {
            addDisplayFields(project);
        });
        $scope.showPage = true;
    }, function (response) {
        $location.path('/'); // not admin, redirect back to root
    });

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        // team
        var teamDisplay = '';
        project.team.forEach(function (email) {
            teamDisplay += email + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);

        // funding
        var fundingDisplay = '$' + project.funding.toFixed(2);

        // add fields to project object
        project.teamDisplay = teamDisplay;
        project.fundingDisplay = fundingDisplay;
        return project;
    }

});
