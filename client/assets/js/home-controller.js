angular.module('portal').controller('homeController', function ($scope, $http) {

    // page title
    $scope.title = 'home';

    // profile section
    $scope.profileFields = ['email', 'name', 'phone'];
    $scope.editProfile = function () {
        // todo: edit profile
    }

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;
    });

});
