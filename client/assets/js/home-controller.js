angular.module('portal').controller('homeController', function ($scope, $http, $location) {

    // page title
    $scope.title = 'home';

    // projects section
    $http.get('/api/project/current').then(function (response) {
        $scope.projects = response.data;

        $scope.projects.forEach(function (project) {

            // create empty categories
            if (!project.infoPublic) {
                project.infoPublic = {};
            }
            if (!project.infoTeam) {
                project.infoTeam = {};
            }
            if (!project.infoAdmin) {
                project.infoAdmin = {};
            }

            project.display = {};

            if (project.name &&
                project.team &&
                project.infoTeam.primary &&
                project.infoPublic.teamDescription &&
                project.infoPublic.pitch &&
                project.infoPublic.projectDescription &&
                project.infoTeam.budgetAmount &&
                project.infoTeam.budgetBreakdown &&
                project.infoTeam.otherFunding &&
                project.infoTeam.timeline) {
                project.display.complete = "yes";
            } else {
                project.display.complete = "no";
            }
        })
    });

});
