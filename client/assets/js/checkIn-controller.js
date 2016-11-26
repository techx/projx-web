angular.module('portal').controller('checkInController', function($scope ,$http, $location, $routeParams) {

    // page title
    $scope.title = 'check in';
    $scope.editStatus = false;
    $scope.checkIn = {};
    $scope.checkInStatus = 'new check in';
    $scope.displayCheckIn = {};
    $scope.project = {};

    // edit project
    $scope.editCheckIn = function () {
        if ($scope.editStatus === true) {
            saveCheckIn($scope.checkIn, function () {
                $location.path('/project/' + $scope.project._id);
            });
        } else {
            $scope.editStatus = true;
        }
    }

    var getCheckIn = function() {
        // Get check in and project info if updating checkin
        // Else just populate project info
        if ($routeParams.checkInId) {
            $http.get('/api/checkIn?checkInId=' + $routeParams.checkInId).then(function (response) {
                if (!response.data._id) {
                    $location.path('/home'); // not authorized
                } else {
                    $scope.checkIn = response.data;
                    $scope.project = $scope.checkIn.project;
                    $scope.checkInStatus = 'updating check-in ' + response.data.number; 
                    makeDisplayCheckIn($scope.checkIn);
                }
            }, function (err) {
                // $location.path('/home');
                sweetAlert('Uh oh, we couldn\'t find that check-in');
            });
     
        } else {
            $http.get('/api/project?projectId=' + $routeParams.projectId).then(function (response) {
                if (!response.data._id) {
                    $location.path('/home'); // not authorized
                } else {
                    $scope.checkIn = {
                        project: response.data._id,
                        progress: '',
                        concerns: '',
                        budgetUsedToDate: '',
                    };
                    $scope.project = response.data;
                    $scope.editStatus = true;
                }
            }, function (err) {
                // $location.path('/home');
                sweetAlert('Uh oh, we couldn\'t find that project');
            });
        }
    }

    var makeDisplayCheckIn = function(checkIn) {
        $scope.displayCheckIn = {
            'progress' : checkIn.progress,
            'concerns': checkIn.concerns,
            'budget used': checkIn.budgetUsedToDate
        };
        console.log($scope);
    }

    var saveCheckIn = function (checkIn, callback) {
        var url = checkIn._id ? '/api/checkIn/update' : '/api/checkIn';
        $http.post(url, {
            'checkIn': checkIn
        }).then(function (result) {
            swal({
                title: "Woohoo!",
                text: "Check in saved successfully.",
                type: "success",
                timer: 1500,
                showConfirmButton: false
            });
            callback(result.data);
        }, function (result) {
            sweetAlert("Oops... save failed", result.data, "error");
        });
    }

    getCheckIn();
 
});
