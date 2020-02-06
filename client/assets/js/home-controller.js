angular.module('portal').controller('homeController', function ($scope, $http, $location, $interval) {
    console.log("running");
    // page title
    $scope.title = 'home';

    // tell if we can edit projects / get funding batch
    $http.get('/api/project/cycle').then(function(response) {
        $scope.open = response.data.open;
        $scope.cycle = response.data.cycle;
        $scope.deadline = response.data.deadline;
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
                project.private.resumeSubmit &&
                project.public.teamDescription &&
                project.public.projectPitch &&
                project.public.projectDescription &&
                project.private.budgetAmount &&
                project.private.budgetBreakdown &&
                project.private.timeline) {
                project.display.complete = "yes";
            } else {
                project.display.complete = "no";
            }
        })
    });

});
