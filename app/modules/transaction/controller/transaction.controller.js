/**
 * Created by Rahul S on 3-10-2016.
 */

(function () {
    'use strict';

    angular
        .module('app.transaction')
        .controller('transaction.controller', transactionController);

    transactionController.$inject = ['$scope', '$location', '$sessionStorage', '$window', 'forexFactory', 'Idle', 'Keepalive', 'NgTableParams'];

    function transactionController($scope, $location, $sessionStorage, $window, forexFactory, Idle, Keepalive, NgTableParams) {

        //Global variable declaration
        $scope.TransactionDetailsDiv = false;

        if ($sessionStorage.UserId === undefined) {  //It checked user is logged in or not. If not then redirect to login
            $location.path('/login');
        }
        else {
            $scope.loading = true;
            if ($sessionStorage.idelWatch === true) {  //It checked idelWatch is on or off.
                Idle.watch();
                $scope.started = $sessionStorage.idelWatch;
            }

            var userIdDetails = {
                "token": $sessionStorage.APIToken,
                "UserId": $sessionStorage.UserId
            };

            var TransactionDetailsData = forexFactory.get_NewCardDetailsByUserId(userIdDetails)
                          .success(function (response, status) {  //if request successfull  
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      $scope.loading = false;
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $scope.TransactionHistoryList = response.UserDetails;
                                      var keys = Object.keys(response.UserDetails);
                                      if (keys.length != 0) {
                                          $scope.TransactionDetailsDiv = true;
                                      }
                                      else {
                                          $scope.TransactionDetailsDiv = false;
                                      }
                                      $scope.bindTransactionDetailsTable('10', '4', $scope.TransactionHistoryList);
                                      $scope.loading = false;
                                  }
                              }
                          })
                          .error(function (response, status) {  //if request fail
                              $scope.loading = false;
                          });

        }
        $scope.bindTransactionDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.TransactionDetailsTable = new NgTableParams(
                      {
                          count: itemCount // set items per page
                      },
                      {
                          counts: [], // hides page sizes
                          paginationMaxBlocks: pgMaxBlocks,
                          //paginationMinBlocks: 2,
                          dataset: datalist
                      });
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
    }
})();