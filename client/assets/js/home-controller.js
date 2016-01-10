angular.module('portal').controller('homeController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'home';

    // profile section
    $scope.profileFields = ['email', 'name', 'phone'];
    $scope.editProfile = function () {
        swal('Profile editing coming soon...');
    }

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;
    });
    $scope.clickProject = function (projectId) {
        $location.path('/project/' + projectId);
    }

});
