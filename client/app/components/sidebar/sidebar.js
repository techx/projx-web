angular.module('projx').controller('sidebarController', function ($scope, $location, $http, user) {
    $scope.go = function (path) {
        $location.path(path);
    }

    $scope.login = function () {
        $http.post('/api/user/loginurl').then(function (response) {
            window.location = response.data;
        }, function (response) {
            swal('Oops...', 'An error occurred...', 'error');
        });
    }

    $scope.logout = function () {
        $http.post('/api/user/logout').then(function (response) {
            window.location = '/';
        }, function (response) {
            window.location = '/';
        });
    }

    user.get(function (currentUser) {
        $scope.user = currentUser;
    });
});
