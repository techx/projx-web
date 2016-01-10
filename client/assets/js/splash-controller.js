angular.module('portal').controller('splashController', function ($scope, $http, $location) {
    $scope.submitLogin = function () {
        $http.post('/api/user/login', {
            'email': $scope.email,
            'password': $scope.password
        }).then(function (response) {
            $location.path('/home');
        }, function (response) {
            swal('Oops...', response.data, 'error');
        });
    }
});
