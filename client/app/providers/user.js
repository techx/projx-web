angular.module('projx').factory('user', function($http) {
    var userService = {};
    var currentUser;

    userService.get = function (cb) {
        $http.get('/api/user/current').then(function (response) {
            if (response.data === '') currentUser = null;
            else currentUser = response.data;
            cb(currentUser);
        });
    }

    return userService;
});
