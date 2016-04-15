angular.module('portal').controller('applyController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'apply';
    $scope.newMember = '';
    $scope.agreed = false;

    $http.get('/api/user/current').then(function (response) {
        $scope.user = response.data;

        $scope.project = {
            name: undefined,
            team: [$scope.user.email],
            infoPublic: {
                pitch: undefined,
                projectDescription: undefined,
                teamDescription: undefined,
            },
            infoTeam: {
                primary: $scope.user.email,
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
        if ($scope.newMember.toLowerCase().endsWith('@mit.edu')) {
            if ($scope.project.team.indexOf($scope.newMember.toLowerCase()) === -1) {
                $scope.project.team.push($scope.newMember.toLowerCase());
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

    $scope.submit = function () {
        $http.post('/api/project', {
            'project': $scope.project
        }).then(function (response) {
            $location.path('/home');
            sweetAlert("Project created", "Project created and saved! Come back to edit anytime before the deadline.", "success");
        }, function (response) {
            console.log(response);
            sweetAlert("Error saving project", response.data, "error");
        });
    }

});
