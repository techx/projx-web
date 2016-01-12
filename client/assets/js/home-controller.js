angular.module('portal').controller('homeController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'home';

    // specify which fields to display (maps field name to key in project object)
    $scope.profileFields = {
        'email': 'email',
        'name': 'name',
        'phone': 'phone',
        'course': 'course',
        'year': 'year'
    };

    // edit profile
    $scope.editProfile = function () {
        swal('Profile editing coming soon...');
    }

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;
    });

});
