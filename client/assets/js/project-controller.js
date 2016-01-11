angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'budget': 'budgetDisplay',
        'description': 'description',
        'team': 'teamDisplay'
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
        var teamDisplay = '';
        project.team.forEach(function (email) {
            teamDisplay += email + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);

        var budgetDisplay = '$' + project.budget.toFixed(2);

        project.teamDisplay = teamDisplay;
        project.budgetDisplay = budgetDisplay;

        return project;
    }

    // edit project
    $scope.editProject = function () {
        swal('Project editing coming soon...');
    }

});
