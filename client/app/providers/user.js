angular.module('projx').factory('user', function($http) {
    var userService = {};
    var currentUser;

    userService.get = function (cb) {
        if (currentUser) cb(currentUser);
        else {
            $http.get('/api/user/current').then(function (response) {
                currentUser = response.data;
                cb(currentUser);
            });
        }
    }

    return userService;
});
