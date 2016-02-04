angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'team': 'teamDisplay',
        'primary': 'primary',
        'point': 'point',
        'granted': 'grantedDisplay',
        'used': 'usedDisplay',
        'pitch': 'pitch',
        'details': 'details',
        'budget': 'budget',
        'timeline': 'timeline',
        'legalese': 'legalese',
        'other': 'other'
    };

    // get project info
    $http.get('/api/project?projectId=' + $routeParams.projectId).then(function (response) {
        if (!response.data._id) {
            $location.path('/home'); // project not returned (e.g. not authorized)
        }

        $scope.project = response.data;
        addDisplayFields($scope.project);
    }, function (response) {
        $location.path('/home');
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
        var grantedDisplay = '$' + project.granted.toFixed(2);
        var usedDisplay = '$' + project.used.toFixed(2);

        // add fields to project object
        project.teamDisplay = teamDisplay;
        project.grantedDisplay = grantedDisplay;
        project.usedDisplay = usedDisplay;
        return project;
    }

    // edit project
    $scope.editProject = function () {
        swal('Project editing coming soon...');
    }

});
