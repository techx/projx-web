angular.module('portal').controller('projectController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'project';
    $scope.editStatus = false;
    $scope.projectDisplay = {};

    $scope.addMember = function () {
        if ($scope.newMember.email.endsWith('@mit.edu')) {
            if ($scope.project.public.team.indexOf($scope.newMember.email) === -1) {
                $scope.project.public.team.push($scope.newMember.email);
            } else {
                sweetAlert("Already added", "Team member is already on the team.", "warning");
            }
            $scope.newMember.email = '';
        } else {
            sweetAlert("Invalid email", "Please enter a valid email that ends with @mit.edu.", "error");
        }
    }

    $http.get('/api/project/cycle').then(function(response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle;
        $scope.resumeLink = response.data.resumeLink;
    });


    $scope.removeMember = function (member) {
        if (member === $scope.user.email) {
            sweetAlert("Oops", "You can't remove yourself from the team!", "error");
        } else {
            $scope.project.public.team.splice($scope.project.public.team.indexOf(member), 1);
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
        if (!project.public) {
            project.public = {};
        }
        if (!project.private) {
            project.private = {};
        }
        if (!project.admin) {
            project.admin = {};
        }

        return project;
    }

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        project.display = {};

        // team
        var teamDisplay = '';
        project.public.team.forEach(function (email) {
            teamDisplay += email + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);

        var budgetAmountDisplay = '';
        if (project.private.budgetAmount) {
            budgetAmountDisplay = '$' + project.private.budgetAmount.toFixed(2);
        } else {
            budgetAmountDisplay = '';
        }

        // add fields to project object
        project.display.team = teamDisplay;
        project.display.budgetAmount = budgetAmountDisplay;
        project.display.location = project.private.location;
        project.display.remoteWorkPlan = project.private.remoteWorkPlan;
        project.display.internetSpeed = project.private.internetSpeed;
        return project;
    }

    var populateDisplay = function () {
        // specify which fields to display (maps field name to key in project object)
        $scope.projectDisplay = {
            'title': $scope.project.name,
            'pitch': $scope.project.public.projectPitch,
            'description': $scope.project.public.projectDescription,
            'members': $scope.project.display.team,
            'team lead': $scope.project.private.primary,
            'background': $scope.project.public.teamDescription,
            'resume submitted': $scope.project.private.resumeSubmit,
            'funding amount': $scope.project.display.budgetAmount,
            'budget': $scope.project.private.budgetBreakdown,
            'miscellaneous': $scope.project.private.otherFunding,
            'timeline': $scope.project.private.timeline,
            'batch': $scope.project.private.batch,
            'status': $scope.project.private.status,
            'contact': $scope.project.private.contact,
            'checks': $scope.project.private.checks,
            // 'instructables': $scope.project.private.instructables,
            // 'makershop': $scope.project.private.makershop,
            'location': $scope.project.private.location,
            'remote work plan': $scope.project.private.remoteWorkPlan,
            'internet speed': $scope.project.private.internetSpeed,
            'complete': false
        };
    }

    var checkCompletion = function () {
        if ($scope.project.name &&
            $scope.project.public.team &&
            $scope.project.private.primary &&
            $scope.project.private.resumeSubmit &&
            $scope.project.public.teamDescription &&
            $scope.project.public.projectPitch &&
            $scope.project.public.projectDescription &&
            $scope.project.private.budgetAmount &&
            $scope.project.private.budgetBreakdown &&
            //Shouldn't be marked as incomplete if miscellaneous isn't filled in
            //$scope.project.private.otherFunding &&
            $scope.project.private.timeline &&
            $scope.project.private.location &&
            $scope.project.private.remoteWorkPlan &&
            $scope.project.private.internetSpeed) {
            $scope.projectDisplay.complete = "yes";
        } else {
            $scope.projectDisplay.complete = "no";
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
