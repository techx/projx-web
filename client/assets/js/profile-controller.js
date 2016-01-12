angular.module('portal').controller('profileController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'profile';

    // specify which fields to display (maps field name to key in project object)
    $scope.profileFields = {
        'email': 'email',
        'name': 'name',
        'phone': 'phone',
        'course': 'course',
        'year': 'year'
    };

    // get profile user
    $http.get('/api/user?email=' + $routeParams.email).then(function (response) {
        console.log(response.data);
        $scope.profileUser = response.data;
    }, function (response) {
        $location.path('/'); // not authorized or user doesn't exist
    });

    // edit profile
    $scope.editProfile = function () {
        swal('Profile editing coming soon...');
    }

});
