(function () {
    'use strict';

    function homeController($scope, $location, loginFactory, $sessionStorage, $route, $window, $routeParams, homeFactory, userdetailsFactory, Idle, Keepalive) {

        if ($sessionStorage.idelWatch === true) {  //It checked idelWatch is on or off.
            Idle.watch();
            $scope.started = $sessionStorage.idelWatch;
        }

        $scope.$on('IdleStart', function () {
            console.log('In IdleStart');
            let time = new Date();
            console.log('idle start at ', time);
            swal({ title: "You're Idle. Do Something!", text: "Click OK to resume otherwise your session will timed out & you'll be logged out", timer: 59000, showConfirmButton: true });
        });

        $scope.$on('IdleTimeout', function () {
            $sessionStorage.$reset();  //Clear the session values 
            $scope.$apply();
            $location.path('/login');    //To redirect page after successful login
            $window.location.reload(); //To refresh page after getting session values
            swal("Opssss...Session expired", "Due to inactivity, your session has timed out & no longer active", "error");
        });

        $scope.ResetPassword_Click = function () {
            if ($scope.Password != undefined && $scope.ConfirmPassword != undefined) {

                if ($scope.Password != $scope.ConfirmPassword) {
                    swal("", "New password & confirm password should be same", "error");
                }
                else {
                    var resetPasswordDetails = {   // getting login details
                        'Password': $scope.ConfirmPassword,
                        'Token': $routeParams.token
                    };

                    var lg = loginFactory.resetPassword(resetPasswordDetails)
                          .success(function (response, status) {            //if login success

                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      swal("", "Password reset successfully", "success");
                                      $scope.Password = null;
                                      $scope.ConfirmPassword = null;
                                      $location.path('/login');
                                  }
                              }
                          })
                          .error(function (response, status) {  //if login fail
                              if (status === 404)
                                  swal("", "Please check internet connection", "error");
                              else
                                  swal("", "Something went wrong", "error");
                          });
                }
            }
            else {
                swal("", "Please fill required fields", "error");
            }
        }
    };

    homeController.$inject = ['$scope', '$location', 'loginFactory', '$sessionStorage', '$route', '$window', '$routeParams', 'homeFactory', 'userdetailsFactory', 'Idle', 'Keepalive'];
    angular.module('app.home').controller('home.controller', homeController);

})();