angular.module('projx', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // routing definitions
    $routeProvider
        .when('/home', {
            templateUrl: '/app/views/home/home.html',
            controller: 'homeController'
        })
        .when('/forum', {
            templateUrl: '/app/views/forum/forum.html',
            controller: 'forumController'
        })
        .otherwise({
            redirectTo: '/home'
        });

        // remove # from URL
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
])
.component('sidebar', {
    templateUrl: '/app/components/sidebar/sidebar.html',
    controller: 'sidebarController'
});
