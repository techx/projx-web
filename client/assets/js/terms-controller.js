angular.module('portal').controller('termsController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'terms';

    $http.get('/api/project/cycle').then(function(response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle;
    });
});
