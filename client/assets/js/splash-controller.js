angular.module('splash', []).controller('splashController', function($scope, $http) {
    console.log('splash running');

    $scope.title = "splash";

    // // tell if we can edit projects / get funding batch
    $http.get('/api/project/cycle').then(function(response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle.toLowerCase();
        $scope.deadline = response.data.deadline;
    });
})