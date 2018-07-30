angular.module('portal').controller('homeController', function ($scope, $http, $location, $interval) {
    console.log("running");
    // page title
    $scope.title = 'home';

    // tell if we can edit projects / get funding batch
    $http.get('/api/project/cycle').then(function(response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle;
    });

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;

        $scope.projects.forEach(function (project) {

            // create empty categories
            if (!project.public) {
                project.public = {};
            }
            if (!project.private) {
                project.private = {};
            }
            if (!project.admin) {
                project.admin = {};
            }

            project.display = {};

            if (project.name &&
                project.public.team &&
                project.private.primary &&
                project.public.teamDescription &&
                project.public.projectPitch &&
                project.public.projectDescription &&
                project.private.budgetAmount &&
                project.private.budgetBreakdown &&
                project.private.otherFunding &&
                project.private.timeline) {
                project.display.complete = "yes";
            } else {
                project.display.complete = "no";
            }
        })
    });


    $http.get('/api/user/countdown').then(function(response) {
        $scope.evName = response.data.eventName;
        $scope.evDate = response.data.eventDate;
        
        $scope.target = new Date($scope.evDate).getTime();
        var promise;

        $scope.activateCD = function() {

            $scope.terminateCD();

            promise = $interval((function() {
                $scope.cur = new Date().getTime();
                $scope.remain = $scope.target - $scope.cur;
                $scope.days = Math.floor($scope.remain / (1000 * 60 * 60 * 24));
                $scope.hrs = Math.floor(($scope.remain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                $scope.min = Math.floor(($scope.remain % (1000 * 60 * 60)) / (1000 * 60));
                $scope.sec = Math.floor(($scope.remain % (1000 * 60)) / 1000);
                $scope.display = $scope.days + " : " + $scope.hrs + " : "
                + $scope.min + " : " + $scope.sec;
                if ($scope.remain < 0) {
                    $scope.terminateCD()
                    $scope.display = "Thank You For Coming!";
                }
            }), 1000);

        };

        $scope.terminateCD = function() {
            $interval.cancel(promise);
        };

        $scope.activateCD();

        $scope.$on('$destroy', function() {
            $scope.terminateCD();
        });

    });

});
