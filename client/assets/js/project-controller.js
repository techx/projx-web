angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';
    $scope.editStatus = false;
    $scope.editText = "edit";

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
    var getProjectInfo = function () {
        $http.get('/api/project?projectId=' + $routeParams.projectId).then(function (response) {
            if (!response.data._id) {
                $location.path('/home'); // project not returned (e.g. not authorized)
            }

            $scope.project = response.data;
            addDisplayFields($scope.project);
        }, function (response) {
            $location.path('/home');
        });
    }

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        // team
        var teamDisplay = '';
        project.team.forEach(function (email) {
            teamDisplay += email + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);

        // funding
        console.log(project.granted);
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
        if ($scope.editStatus === true) {
            saveProject($scope.project, function () {
                getProjectInfo();
                $scope.editStatus = false;
                $scope.editText = "edit";
            });
        } else {
            $scope.editStatus = true;
            $scope.editText = "save";
        }
    }

    var saveProject = function (project, callback) {
        $http.post('/api/project/update', {
            'project': project
        }).then(function (result) {
            swal("Saved!", "Project saved successfully.", "success")
            callback();
        }, function (result) {
            sweetAlert("Oops...", "Something went wrong with saving!", "error");
            callback();
        });
    }

    // get info right away
    getProjectInfo();

});
