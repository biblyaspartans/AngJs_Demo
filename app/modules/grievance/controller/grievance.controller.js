/**
 * Created by Rahul S on 3-10-2016.
 */

(function () {
    'use strict';

    angular
        .module('app.grievance')
        .controller('grievance.controller', grievanceController);

    grievanceController.$inject = ['$scope', '$location', '$sessionStorage', '$window', 'homeFactory', 'userdetailsFactory', 'Idle', 'Keepalive', 'NgTableParams', '$filter'];

    function grievanceController($scope, $location, $sessionStorage, $window, homeFactory, userdetailsFactory, Idle, Keepalive, NgTableParams, $filter) {

        //Global variable declaration
        $scope.GrievanceDetailsList;
        $scope.IsGrievancesDisbale = false;
        $scope.GrievanceDetailsDiv = false;

        if ($sessionStorage.UserId === undefined) {  //It checked user is logged in or not. If not then redirect to login
            $location.path('/login');
        }
        else {
            $scope.loading = true;
            var grievanceUserDtls = {
                "token": $sessionStorage.APIToken,
                "UserDetails": {
                    "UserId": $sessionStorage.UserId
                }
            };

            var getGrievanceDetails = homeFactory.get_GrievanceDetails(grievanceUserDtls)
                           .success(function (response, status) {            //if details successfully posted to server
                               if (status === 200) {
                                   if (response.Message.isError === '1') {
                                       swal("", response.Message.errorMessage, "error");
                                   }
                                   else {
                                       $scope.GrievanceDetailsList = response.Grievances;
                                       var keys = Object.keys(response.Grievances);
                                       if (keys.length != 0) {
                                           $scope.GrievanceDetailsDiv = true;
                                       }
                                       else {
                                           $scope.GrievanceDetailsDiv = false;
                                       }
                                       $scope.bindGrievanceDetailsTable('10', '4', $scope.GrievanceDetailsList);
                                   }
                               }
                           })
                           .error(function (response, status) {
                           });

            var getGrievancesTypeList = homeFactory.get_GrievancesTypeList(grievanceUserDtls)
                           .success(function (response, status) {            //if details successfully posted to server
                               if (status === 200) {

                                   if (response.Message.isError === '1') {
                                       swal("", response.Message.errorMessage, "error");
                                   }
                                   else {
                                       $scope.GrievancesTypeList = response.GrievancesType
                                   }
                               }
                           })
                           .error(function (response, status) {
                           });

            var ProductsDetailsData = userdetailsFactory.get_ProductsList()
                            .success(function (response, status) {  //if request successfull  
                                if (status === 200) {
                                    if (response.Message.isError === '1') {
                                        swal("", response.Message.errorMessage, "error");
                                    }
                                    else {
                                        $scope.ProductsList = response.ProductType;
                                    }
                                }
                            })
                            .error(function (response, status) {  //if request fail
                            });

            $scope.loading = false;
        }

        $scope.bindGrievanceDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.GrievanceDetailsTable = new NgTableParams(
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

        $scope.SaveGrievance_Click = function (frmGrievances) {

            if (frmGrievances.$valid) {
                $scope.loading = true;
                $scope.IsGrievancesDisbale = true;

                var grievanceDetails = {
                    "token": $sessionStorage.APIToken,
                    "Grievances": {
                        "UserId": $sessionStorage.UserId,
                        "ProductId": $scope.Grievances.Product,
                        "GrievancesTypeId": $scope.Grievances.GrievancesType,
                        "ReferenceNumber": $scope.Grievances.ReferenceNumber,
                        "QueryDetails": $scope.Grievances.QueryDetails,
                        "Status": "Open"
                    }
                };

                var lg = homeFactory.grievance(grievanceDetails)
                .success(function () {
                    $scope.loading = false;
                    $location.path('/grievancelist');  //To redirect page after successful call
                    swal("", "Grievance registered successfully, will process on it shortly", "success");
                })
                .error(function (response, status) {
                    $scope.loading = false;
                    swal("", "Please enter valid data", "error");
                })
            }
        }

        $scope.BackToGrievancesList = function () {
            $location.path('/grievancelist');
        };

        //for modalpopup
        $scope.showModal = false;
        $scope.grievanceId = "";
        $scope.toggleModal = function (grievanceid) {
            $scope.grievanceId = grievanceid;
            var grievance = $scope.GrievanceDetailsList.filter(
                function (data) {
                    return data._id === grievanceid
                }
            )[0];
            $scope.grievanceViewDetails = {
                'TicketNo': grievance.TicketNumber,
                'RaiseDate': $filter('date')(grievance.CreatedDatetime, "yyyy-MM-dd"),
                'Product': grievance.ProductId.ProductType,
                'GrievanceType': grievance.GrievancesTypeId.GrievancesType,
                'ReferenceNumber': grievance.ReferenceNumber,
                'QueryDetails': grievance.QueryDetails,
                'Status': grievance.Status
            };

            $scope.showModal = !$scope.showModal;
        };

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