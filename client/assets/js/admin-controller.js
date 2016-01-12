angular.module('portal').controller('adminController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'admin';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'point': 'pointDisplay',
        'primary': 'primaryDisplay',
        'funding': 'fundingDisplay'
    };

    // sorting state
    $scope.sortKey = 'pointDisplay';
    $scope.sortReverse = -1; // 1 or -1

    // get all projects
    $http.get('/api/project/all').then(function (response) {
        $scope.projects = response.data;
        $scope.projects.forEach(function (project) {
            addDisplayFields(project);
        });
        $scope.sortBy('pointDisplay');
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
        project.teamDisplay = teamDisplay;

        // funding
        project.fundingDisplay = '$' + project.funding.toFixed(2);

        // point
        project.pointDisplay = project.point.split('@')[0];

        // primary
        project.primaryDisplay = project.primary.split('@')[0];

        return project;
    }

    // sort by given key; reverse if already sorted by given key
    $scope.sortBy = function (key) {
        if (key === $scope.sortKey) {
            $scope.sortReverse *= -1;
        } else {
            $scope.sortKey = key;
            $scope.sortReverse = 1;
        }

        $scope.projects.sort(function (p1, p2) {
            if ($scope.sortReverse > 0) {
                return  (p1[key] > p2[key]);
            } else {
                return  (p1[key] < p2[key]);
            }
        });
    }

});
