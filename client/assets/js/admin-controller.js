angular.module('portal').controller('adminController', function ($route, $scope, $http, $location) {

    // page title
    $scope.title = 'admin';

    // adding new admin and projx team member 
    $scope.changeAdminEmail = '';
    $scope.changeTeamMemberEmail = '';

    // specify which fields to display (maps field name to key in project object)
    $scope.projectFields = {
        'name': 'name',
        'team': 'teamDisplay',
        'status': 'status',
        'contact': 'contact'
    };

    // sorting state
    $scope.sortKey = 'pointDisplay';
    $scope.sortReverse = true;


    // store projx members
    $http.get('/api/user/getProjxmembers').then(function (response) {
        $scope.projxmembersDict = {};
        response.data.forEach(function(projxmember) {
            $scope.projxmembersDict[projxmember.email] = projxmember.name;
        });
    });

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

        return project;
    }

    // sort by given key; reverse if already sorted by given key
    $scope.sortBy = function (key) {
        if (key === $scope.sortKey) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortKey = key;
            $scope.sortReverse = false;
        }
    }

    $scope.adminUpdate = function () {
        $scope.projectsUpdated = [];
        $scope.internalError = false;

        $scope.projects.forEach(function(project) {

            $scope.projectMatches = 0;
            $scope.projectsOldState.forEach(function(projectOld) {
                if (project._id === projectOld._id) {
                    $scope.projectMatches += 1;
                    // if (project.private.status !== projectOld.private.status) {
                    //     $scope.statusChangeUpdater(project);
                    // };
                    if (project.private.status !== projectOld.private.status || 
                        project.private.contact !== projectOld.private.contact) {
                        $scope.projectsUpdated += project;
                    };
                }
            });
            
            if ($scope.projectMatches !== 1) {
                $internalError = true;
                console.log('Project states are not alligned correctly');
            }

            if (!$scope.internalError) {
                $http.post('/api/project/update', {
                    'project': project
                }).then(function (response) {
                    console.log("Project Updated!")
                }, function (response) {
                    $scope.internalError = true;
                    console.log('Error accessing server to complete update');
                });
            };

        });

        if (!$scope.internalError) {
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
        $scope.team = project.public.team;
        $scope.team.forEach(function(member) {
            // needs implementation
        });
    };

    // get all admin
    $http.get('/api/user/getUsers').then(function(response) {
        $scope.admins = {};
        $scope.comUsers = {};
        $scope.userData = response.data;
        console.log("ALL USERS: ", $scope.userData);
        $scope.userData.forEach(function(user) {
            if (user.isAdmin === true) {
                $scope.admins[user.email] = user.name;
            } else {
                $scope.comUsers[user.email] = user.name;
            };
        });
    });


    $scope.addAdmin = function() {
        $scope.internalError = false;

        if ($scope.comUsers[$scope.changeAdminEmail]) {

            $scope.changeUser = $http.post('/api/user/getSingleUser', {
                "email": $scope.changeAdminEmail
            }).then(function (response) {
                console.log("Found User!")
            }, function (response) {
                $scope.internalError = true;
                console.log('Error finding user.');
            });

            $scope.userData.forEach(function(user) {
                if (user.email === $scope.changeAdminEmail) {
                    $scope.identifiedUser = user;
                };
            });

            if (!$scope.identifiedUser) {
                console.log("Error finding user.");
            };
            
            $scope.identifiedUser.isAdmin = true;
            
            $http.post('/api/user/update', {
                'user': $scope.identifiedUser
            }).then(function (response) {
                console.log("User Updated!")

                swal({
                    title: "WooHoo!",
                    text: "This user is now an admin!",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                $route.reload();

            }, function (response) {
                $scope.internalError = true;
                console.log('Error updating user to admin.');
            });
            
        } else if ($scope.admins[$scope.changeAdminEmail]) {
            swal({
                title: "already admin!",
                text: "This user is already an admin!",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            swal({
                title: "user not found",
                text: "The email that you entered is not a current user.",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
        };

    };


    $scope.removeAdmin = function() {
        $scope.internalError = false;

        if ($scope.admins[$scope.changeAdminEmail]) {

            // look into direct implement as done for addMember

            $scope.userData.forEach(function(user) {
                if (user.email === $scope.changeAdminEmail) {
                    $scope.identifiedUser = user;
                };
            });
            
            if (!$scope.identifiedUser) {
                console.log("Error finding user.");
            };
            
            $scope.identifiedUser.isAdmin = false;
            
            $http.post('/api/user/update', {
                'user': $scope.identifiedUser
            }).then(function (response) {
                console.log("User Updated!")

                swal({
                    title: "WooHoo!",
                    text: "This admin has been removed!",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                $route.reload();


            }, function (response) {
                $scope.internalError = true;
                console.log('Error updating user to deny admin.');
            });

        } else if ($scope.comUsers[$scope.changeAdminEmail]) {
            swal({
                title: "not admin!",
                text: "This user was not an admin!",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            swal({
                title: "user not found",
                text: "The email that you entered is not a current user.",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
        };
        
    };

});
