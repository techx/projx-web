angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';
    $scope.editStatus = false;
    $scope.projectDisplay = {};

    $scope.addMember = function () {
        if ($scope.newMember.endsWith('@mit.edu')) {
            if ($scope.project.team.indexOf($scope.newMember) === -1) {
                $scope.project.team.push($scope.newMember);
            } else {
                sweetAlert("Already added", "Team member is already on the team.", "warning");
            }
            $scope.newMember = '';
        } else {
            sweetAlert("Invalid email", "Please enter a valid email that ends with @mit.edu.", "error");
        }
    }

    $scope.removeMember = function (member) {
        if (member === $scope.user.email) {
            sweetAlert("Oops", "You can't remove yourself from the team!", "error");
        } else {
            $scope.project.team.splice($scope.project.team.indexOf(member), 1);
        }
    }

    // get project info
    var getProjectInfo = function () {
        $http.get('/api/project?projectId=' + $routeParams.projectId).then(function (response) {
            if (!response.data._id) {
                $location.path('/home'); // project not returned (e.g. not authorized)
            }

            $scope.project = response.data;
            addEmptyFields($scope.project);
            addDisplayFields($scope.project);
            populateDisplay();
            checkCompletion();
        }, function (response) {
            $location.path('/home');
        });
    }

    // adds pretty display fields to project object
    var addEmptyFields = function (project) {

        // create empty categories
        if (!project.infoPublic) {
            project.infoPublic = {};
        }
        if (!project.infoTeam) {
            project.infoTeam = {};
        }
        if (!project.infoAdmin) {
            project.infoAdmin = {};
        }

        return project;
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

        var budgetAmountDisplay = '';
        if (project.infoTeam.budgetAmount) {
            budgetAmountDisplay = '$' + project.infoTeam.budgetAmount.toFixed(2);
        } else {
            budgetAmountDisplay = '';
        }

        // add fields to project object
        project.display.team = teamDisplay;
        project.display.budgetAmount = budgetAmountDisplay;
        return project;
    }

    var populateDisplay = function () {
        // specify which fields to display (maps field name to key in project object)
        $scope.projectDisplay = {
            'name': $scope.project.name,
            'team': $scope.project.display.team,
            'team lead': $scope.project.infoTeam.primary,
            'team description': $scope.project.infoPublic.teamDescription,
            'pitch': $scope.project.infoPublic.pitch,
            'project description': $scope.project.infoPublic.projectDescription,
            'budget requested': $scope.project.display.budgetAmount,
            'budget breakdown': $scope.project.infoTeam.budgetBreakdown,
            'other funding': $scope.project.infoTeam.otherFunding,
            'timeline': $scope.project.infoTeam.timeline,
            'batch': $scope.project.infoTeam.batch,
            'status': $scope.project.infoTeam.status,
            'complete': false
        };
    }

    var checkCompletion = function () {
        if ($scope.project.name &&
            $scope.project.team &&
            $scope.project.infoTeam.primary &&
            $scope.project.infoPublic.teamDescription &&
            $scope.project.infoPublic.pitch &&
            $scope.project.infoPublic.projectDescription &&
            $scope.project.infoTeam.budgetAmount &&
            $scope.project.infoTeam.budgetBreakdown &&
            $scope.project.infoTeam.otherFunding &&
            $scope.project.infoTeam.timeline) {
            $scope.projectDisplay.complete = true;
        } else {
            $scope.projectDisplay.complete = false;
        }
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
            sweetAlert("Oops... save failed", result.data, "error");
        });
    }

    // get info right away
    getProjectInfo();

});
