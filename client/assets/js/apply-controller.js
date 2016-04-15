angular.module('portal').controller('applyController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'apply';
    $scope.newMember = '';
    $scope.agreed = false;

    $http.get('/api/user/current').then(function (response) {
        $scope.user = response.data;

        $scope.project = {
            name: "catcy project name",
            team: [$scope.user.email],
            infoPublic: {
                pitch: undefined,
                projectDescription: undefined,
                teamDescription: undefined,
            },
            infoTeam: {
                primary: undefined,
                program: undefined,
                status: undefined,
                budgetAmount: undefined,
                budgetUsed: undefined,
                budgetBreakdown: undefined,
                otherFunding: undefined,
                timeline: undefined,
                point: undefined
            },
            infoAdmin: {
                comments: undefined
            }
        }
    });

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
            $scope.project.team.pop($scope.project.team.indexOf($scope.newMember));
        }
    }

    $scope.submit = function () {
        $http.post('/api/project', {
            'project': $scope.project
        }).then(function (response) {
            console.log(response);
            $location.path('/home');
            sweetAlert("Project created", "Project created and saved! Come back to edit anytime before the deadline.", "success");
        }, function (response) {
            console.log(response);
            sweetAlert("Error saving project", "There was an error submitting your project. Please email projx@mit.edu for help.", "error");
        });
    }

});
