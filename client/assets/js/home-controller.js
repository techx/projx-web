angular.module('portal').controller('homeController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'home';

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;
    });

});
