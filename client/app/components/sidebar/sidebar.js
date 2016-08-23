angular.module('projx').controller('sidebarController', function ($scope, $location, user) {
    $scope.go = function (path) {
        $location.path(path);
    }
});
