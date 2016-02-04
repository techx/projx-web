angular.module('portal').controller('profileController', function ($scope, $http, $location, $routeParams) {

    // page title
    $scope.title = 'profile';
    $scope.editStatus = false;
    $scope.editText = "edit";

    // specify which fields to display (maps field name to key in project object)
    $scope.profileFields = {
        'email': 'email',
        'name': 'name',
        'phone': 'phone',
        'course': 'course',
        'year': 'year'
    };

    // get profile user
    var getProfileInfo = function () {
        $http.get('/api/user?email=' + $routeParams.email).then(function (response) {
            console.log(response.data);
            $scope.profileUser = response.data;
        }, function (response) {
            sweetAlert("Oops...", "User not found!", "error");
        });
    }

    // edit profile
    $scope.editProfile = function () {
        if ($scope.editStatus === true) {
            saveProfile($scope.profileUser, function () {
                getProfileInfo();
                $scope.editStatus = false;
                $scope.editText = "edit";
            });
        } else {
            $scope.editStatus = true;
            $scope.editText = "save";
        }
    }

    var saveProfile = function (user, callback) {
        $http.post('/api/user/update', {
            'user': user
        }).then(function (result) {
            swal("Saved!", "Profile saved successfully.", "success")
            callback();
        }, function (result) {
            sweetAlert("Oops...", "Something went wrong with saving!", "error");
            callback();
        });
    }

    // get info right away
    getProfileInfo();


});
