angular.module('portal').controller('adminController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'admin';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'team': 'teamDisplay'
    };

    // sorting state
    $scope.sortKey = 'pointDisplay';
    $scope.sortReverse = true;

    // get all projects
    $http.get('/api/project/all').then(function (response) {
        $scope.projects = response.data;
        $scope.projects.forEach(function (project) {
            addDisplayFields(project);
        });
        $scope.sortBy('name');
    }, function (response) {
        $location.path('/portal'); // not admin, redirect back to root
    });

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        // team
        var teamDisplay = '';
        project.public.team.forEach(function (email) {
            teamDisplay += email.replace(/@mit.edu/g, '') + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);
        project.teamDisplay = teamDisplay;

        return project;
    }

    // sort by given key; reverse if already sorted by given key
    $scope.sortBy = function (key) {
        if (key === $scope.sortKey) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortKey = key;
            $scope.sortReverse = false;
        }
    }

});
