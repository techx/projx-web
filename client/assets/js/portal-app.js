angular.module('portal', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        // routing definitions
    $routeProvider
        .when('/', {
            templateUrl: '/views/login.html',
            controller: 'loginController'
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
