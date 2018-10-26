angular.module('portal').controller('adminController', function ($route, $scope, $http, $location) {

    // page title
    $scope.title = 'admin';

    // adding new admin
    $scope.changeAdminEmail = '';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'team': 'teamDisplay',
        'status': 'status',
        'contact': 'contact', 
        'checks': 'checks'
    };

    // sorting state
    $scope.sortKey = 'pointDisplay';
    $scope.sortReverse = true;


    // get all projects
    $http.get('/api/project/all').then(function (response) {
        $scope.projects = response.data;
        $scope.projectsOldState = angular.copy($scope.projects)
        $scope.projects.forEach(function (project) {
            addDisplayFields(project);
        });
        $scope.sortBy('name');
    }, function (response) {
        $location.path('/portal'); // not admin, redirect back to root
    });

    var dateFromObjectId = function (objectId) {
    	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    var prettyDate = function (date) {
      var secs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (secs < 60) return secs + " sec ago";
      if (secs < 3600) return Math.floor(secs / 60) + " min ago";
      if (secs < 86400) return Math.floor(secs / 3600) + " hour ago";
      if (secs < 604800) return Math.floor(secs / 86400) + " day ago";
      return date.toDateString();
    }

    // adds pretty display fields to project object
    var addDisplayFields = function (project) {

        // team
        var teamDisplay = '';
        project.public.team.forEach(function (email) {
            teamDisplay += email.replace(/@mit.edu/g, '') + ', ';
        })
        teamDisplay = teamDisplay.substring(0, teamDisplay.length - 2);
        project.teamDisplay = teamDisplay;

        // date
        project.date = prettyDate(dateFromObjectId(project._id));

        // current application cycle
        project.current = dateFromObjectId(project._id) > new Date('Sept 1, 2018');

        return project;
    }

    // var filterProjects = element(by.model('currentProjects'));
    // filterProjects.clear

    // sort by given key; reverse if already sorted by given key
    $scope.sortBy = function (key) {
        if (key === $scope.sortKey) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortKey = key;
            $scope.sortReverse = false;
        }
    }

    // save changes to all project's decisions and contacts
    $scope.adminUpdate = function () {
        let projectsUpdated = [];
        let internalError = false;

        $scope.projects.forEach(function(project) {

            let projectMatches = 0;
            $scope.projectsOldState.forEach(function(projectOld) {
                if (project._id === projectOld._id) {
                    projectMatches += 1;
                    // if (project.private.status !== projectOld.private.status) {
                    //     $scope.statusChangeUpdater(project);
                    // };
                    if (project.private.status !== projectOld.private.status || 
                        project.private.contact !== projectOld.private.contact ||
                        project.private.checks !== projectOld.private.checks) {
                        projectsUpdated += project;
                    };
                }
            });
            
            if (projectMatches !== 1) {
                internalError = true;
            }

            if (!internalError) {
                $http.post('/api/project/update', {
                    'project': project
                }).then(function (err) {
                    internalError = true;
                });
            };

        });

        if (!internalError) {
            swal({
                title: "Woohoo!",
                text: "All Projects Saved!",
                type: "success",
                timer: null,
                showConfirmButton: true
            });
        } else {
            swal({
                title: "Oh No!",
                text: "Error Occured!",
                type: "error",
                timer: null,
                showConfirmButton: true
            });
        };
        
    };


    // sends email to everyone who's project's status has changed
    $scope.statusChangeUpdater = function(project) {
        let team = project.public.team;
        team.forEach(function(member) {
            // needs implementation
        });
    };


    // get all admin
    $http.get('/api/user/getAdmin').then(function(response) {
        $scope.admins = {};
        response.data.forEach(function(user) {
            $scope.admins[user.email] = user.name;
        });
    });


    //get current user data
    $http.get('/api/user/current').then(function (response) {
        $scope.curUser = response.data;
    });


    // sets user's isAdmin param to true
    $scope.addAdmin = function() {

        $http.get('/api/user', {
            params : { 
                'email': $scope.changeAdminEmail,
                'curEmail': $scope.curUser.email, 
                'curAdmin': $scope.curUser.isAdmin
            }
        }).then(function (response) {
            let changeUser = response.data;

            if ( changeUser.isAdmin == true ) {
                swal({
                    title: "already admin!",
                    text: "This user is already an admin!",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
    
            } else if ( changeUser.isAdmin == false ) {
                changeUser.isAdmin = true;
                $http.post('/api/user/update', {
                    'user': changeUser
                }).then(function (response) {
    
                    swal({
                        title: "WooHoo!",
                        text: "This user is now an admin!",
                        type: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
    
                    $route.reload();
                });
            };

        }, function (response) {
            swal({
                title: "user not found",
                text: "The email that you entered is not a current user.",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
        });
        
    };



    // sets user's isAdmin param to false
    $scope.removeAdmin = function() {

        $http.get('/api/user', {
            params : { 
                'email': $scope.changeAdminEmail
            }
        }).then(function (response) {

            let changeUser = response.data;

            if ( changeUser.isAdmin == false ) {
                swal({
                    title: "not an admin!",
                    text: "This user is not an admin!",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
    
            } else if ( changeUser.isAdmin == true ) {
                changeUser.isAdmin = false;
                $http.post('/api/user/update', {
                    'user': changeUser
                }).then(function (response) {
                    swal({
                        title: "WooHoo!",
                        text: "This admin has been removed!",
                        type: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
    
                    $route.reload();
                });
            };

        }, function (response) {
            swal({
                title: "user not found",
                text: "The email that you entered is not a current user.",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
        });

    };

});
