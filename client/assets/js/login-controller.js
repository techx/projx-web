angular.module('portal').controller('loginController', function ($scope, $http, $location) {

    $scope.showPage = false;

    // redirect home if logged in
    $http.get('/api/user/current').then(function (response) {
        $location.path('/home');
    }, function (response) {
        $scope.showPage = true;
    });

    // log in with certificates by redirecting
    $scope.certLogin = function () {
        window.location = 'https://vfazel.scripts.mit.edu:444/projx-auth.php';
    }

});
