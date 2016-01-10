angular.module('portal').controller('loginController', function ($scope, $http, $location) {

    $scope.showPage = false;

    // redirect home if logged in
    $http.get('/api/user/current').then(function (response) {
        $location.path('/home');
    }, function (response) {
        $scope.showPage = true;
    });

    // submitting login form redirects home if successful or displays error message
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