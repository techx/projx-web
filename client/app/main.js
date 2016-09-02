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
        .when('/profile/:email', {
            templateUrl: '/app/views/profile/profile.html',
            controller: 'profileController'
        })
        .when('/forum/thread/:threadId', {
            templateUrl: '/app/views/forum/thread/thread.html',
            controller: 'threadController'
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
})
.component('footer', {
    templateUrl: '/app/components/footer/footer.html'
})
.component('threadCard', {
    templateUrl: '/app/components/thread-card/thread-card.html',
    controller: 'threadCardController'
});
