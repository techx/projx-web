angular.module('portal').controller('applyController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'apply';
    $scope.newMember = '';
    $scope.agreed = false;

    $http.get('/api/user/current').then(function (response) {
        $scope.user = response.data;

        $scope.project = {
            name: "Awesome Project",
            team: [$scope.user.email],
            infoPublic: {
                pitch: undefined,
                projectDescription: undefined,
                teamDescription: undefined,
            },
            infoTeam: {
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

    $scope.submit = function () {
        sweetAlert('submit time');
    }

});
