angular.module('portal').controller('checkInController', function($scope ,$http, $location, $routeParams) {

    // page title
    $scope.title = 'checkin';
    $scope.ediStatus = false;
    $scope.checkIn = {};

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
 
});
