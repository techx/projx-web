angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';
    $scope.editStatus = false;
    $scope.projectDisplay = {};

    var populateDisplay = function () {
        // specify which fields to display (maps field name to key in project object)
        $scope.projectDisplay = {
            'name': $scope.project.name,
            'team': $scope.project.display.team,
            'primary lead': $scope.project.infoTeam.primary,
            'team description': $scope.project.infoPublic.teamDescription,
            'pitch': $scope.project.infoPublic.pitch,
            'project description': $scope.project.infoPublic.projectDescription,
            'budget requested': $scope.project.display.budgetAmount,
            'budget breakdown': $scope.project.infoTeam.budgetBreakdown,
            'other funding': $scope.project.infoTeam.otherFunding,
            'timeline': $scope.project.infoTeam.timeline
        };
    }

    // get project info
    var getProjectInfo = function () {
        $http.get('/api/project?projectId=' + $routeParams.projectId).then(function (response) {
            if (!response.data._id) {
                $location.path('/home'); // project not returned (e.g. not authorized)
            }

            $scope.project = response.data;
            addDisplayFields($scope.project);
            populateDisplay();
        }, function (response) {
            $location.path('/home');
        });
    }

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        project.display = {};

        // team
        var teamDisplay = '';
        project.team.forEach(function (email) {
            teamDisplay += email + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);

        var budgetAmountDisplay = '$' + project.infoTeam.budgetAmount.toFixed(2);

        // add fields to project object
        project.display.team = teamDisplay;
        project.display.budgetAmount = budgetAmountDisplay;
        return project;
    }

    // edit project
    $scope.editProject = function () {
        if ($scope.editStatus === true) {
            saveProject($scope.project, function () {
                getProjectInfo();
                $scope.editStatus = false;
            });
        } else {
            $scope.editStatus = true;
        }
    }

    var saveProject = function (project, callback) {
        $http.post('/api/project/update', {
            'project': project
        }).then(function (result) {
            swal({
                title: "Woohoo!",
                text: "Project saved successfully.",
                type: "success",
                timer: 1500,
                showConfirmButton: false
            });
            callback();
        }, function (result) {
            sweetAlert("Oops...", "Something went wrong with saving!", "error");
            callback();
        });
    }

    // get info right away
    getProjectInfo();

});
