angular.module('portal', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        // routing definitions
    $routeProvider
        .when('/', {
            templateUrl: '/views/splash.html',
            controller: 'splashController'
        })
        .otherwise({
            redirectTo: '/'
        });

        // remove # from URL
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
]);
