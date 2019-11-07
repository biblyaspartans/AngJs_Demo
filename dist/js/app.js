(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Rahuls on 20/6/2016.
 */

'use strict';

// Init the application configuration module for AngularJS application
window.ApplicationConfiguration = (function () {

    var applicationModuleName = 'app';

    var applicationModuleVendorDependencies = ['ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngCookies',
        'ngStorage',
        'ngMessages',
        'jcs-autoValidate',
        'google.places',
        'angularjs-crypto',
        'angularUtils.directives.dirPagination',
        'ngIdle',
        'ui.bootstrap',
        'ngTable'
    ];

    angular.module(applicationModuleName, applicationModuleVendorDependencies || []);

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
    angular.module(applicationModuleName)
    .run([
    'defaultErrorMessageResolver',
    function (defaultErrorMessageResolver) {
        defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
            errorMessages['emailInvalid'] = 'invalid email address';
        });
    }
    ]);

    angular.module(applicationModuleName).config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
        IdleProvider.idle(5);
        IdleProvider.timeout(5);
        KeepaliveProvider.interval(10);
    }]);

    angular.module(applicationModuleName).run(['Idle', function (Idle) {
        Idle.watch();
    }]);

})();

},{}],2:[function(require,module,exports){
/**
 * Created by rahuls on 30-05-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.forex')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

            .when('/forex', {
                templateUrl: 'app/modules/forex/views/forex_home.html',
                controller: 'forex.controller',
                resolve: {
                }
            })
            .when('/foreignexchange', {
                templateUrl: 'app/modules/forex/views/forex_foreignexchange.html',
                controller: 'forex.controller',
                resolve: {
                }
            })
            .when('/remittance', {
                templateUrl: 'app/modules/forex/views/forex_remittance.html',
                controller: 'forex.controller',
                resolve: {
                }
            })
            .when('/remittanceorder', {
                templateUrl: 'app/modules/forex/views/forex_remittanceorder.html',
                controller: 'forex.controller',
                resolve: {
                }
            })
            .when('/freshcard', {
                templateUrl: 'app/modules/forex/views/forex_freshcard.html',
                controller: 'forex.controller',
                resolve: {
                }
            });
    }
})();
},{}],3:[function(require,module,exports){
/**
 * Created by Rahul Salve on 30/5/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.forex')
        .controller('forex.controller', forexController);

    forexController.$inject = ['$scope', '$location', 'loginFactory', 'cookiesService', '$sessionStorage', '$route', '$window', 'userdetailsFactory', '$filter', 'forexFactory', 'homeFactory', 'Idle', 'Keepalive', 'NgTableParams', 'DocumentUploadPath'];

    function forexController($scope, $location, loginFactory, cookiesService, $sessionStorage, $route, $window, userdetailsFactory, $filter, forexFactory, homeFactory, Idle, Keepalive, NgTableParams, DocumentUploadPath) {

        //Global variable declaration
        $scope.UpdateNewCard = { '_id': null }
        $scope.DivIsVisible = false;
        $scope.IsCardReload = false;
        $scope.NewCardDetails = { 'ProductTypeId': '' }
        $scope.GrievanceDetailsList;
        $scope.PageName;
        $scope.IsGrievancesDisbale = false;
        $scope.IsOrderDisbale = false;
        $scope.DocumentLink = DocumentUploadPath;
        $scope.TransactionDetailsDiv = true;
        $scope.DocumentDetailsDiv = false;

        if ($sessionStorage.UserId === undefined) {  //It checked user is logged in or not. If not then redirect to login
            $location.path('/login');
        }
        else {

            if ($sessionStorage.idelWatch === true) {  //It checked idelWatch is on or off.
                Idle.watch();
                $scope.started = $sessionStorage.idelWatch;
            }

            $('#liTab2').removeClass('active');
            $('#liTab1').addClass('active');

            var userIdDetails = {
                "token": $sessionStorage.APIToken,
                "UserId": $sessionStorage.UserId
            };

            var CurrencyDetailsData = userdetailsFactory.get_CurrencyDetails()
                           .success(function (response, status) {  //if request successfull  
                               if (status === 200) {

                                   if (response.Message.isError === '1') {
                                       swal("", response.Message.errorMessage, "error");
                                   }
                                   else {
                                       $scope.CurrencyList = response.CurrencyDetails;
                                   }
                               }
                           })
                           .error(function (response, status) {  //if request fail
                           });

            var ProductsDetailsData = userdetailsFactory.get_ProductsList()
                          .success(function (response, status) {  //if request successfull  
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {

                                      $scope.ProductsList = response.ProductType;

                                      if ($sessionStorage.SessionPageName === "FreshCard") {
                                          var product = $scope.ProductsList.filter(
                                              function (data) {
                                                  return data.ProductType.trim() == "Fresh Card"
                                              }
                                          )[0];
                                          $scope.PageName = "Fresh Card"
                                          $scope.NewCardDetails.ProductTypeId = product._id;
                                      }
                                      else if ($sessionStorage.SessionPageName === "Currency") {
                                          var product = $scope.ProductsList.filter(
                                              function (data) {
                                                  return data.ProductType.trim() == "Currency"
                                              }
                                          )[0];
                                          $scope.PageName = "Currency"
                                          $scope.NewCardDetails.ProductTypeId = product._id;
                                      }
                                      else if ($sessionStorage.SessionPageName === "DemandDraft") {

                                          var product = $scope.ProductsList.filter(
                                              function (data) {
                                                  return data.ProductType.trim() == "Demand Draft"
                                              }
                                          )[0];
                                          $scope.PageName = "Demand Draft"
                                          $scope.Beneficiarydetails = { 'RemittanceType': 'DD' };
                                          $scope.NewCardDetails.ProductTypeId = product._id;
                                      }
                                      else if ($sessionStorage.SessionPageName === "CardReload") {
                                          var product = $scope.ProductsList.filter(
                                              function (data) {
                                                  $scope.IsCardReload = true;
                                                  return data.ProductType.trim() == "Card Reload"
                                              }
                                          )[0];
                                          $scope.PageName = "Card Reload"
                                          $scope.NewCardDetails.ProductTypeId = product._id;
                                      }
                                      else if ($sessionStorage.SessionPageName === "WiredTransfer") {

                                          var product = $scope.ProductsList.filter(
                                              function (data) {
                                                  return data.ProductType.trim() == "Wired Transfer"
                                              }
                                          )[0];

                                          $scope.PageName = "Wired Transfer"
                                          $scope.Beneficiarydetails = { 'RemittanceType': 'TT' };
                                          $scope.NewCardDetails.ProductTypeId = product._id;
                                      }
                                  }
                              }
                          })
                          .error(function (response, status) {  //if request fail
                          });

            var CountryDetailsData = userdetailsFactory.get_CountryDetails()
                          .success(function (response, status) {  //if request successfull  
                              if (status === 200) {

                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $scope.CountryList = response.CountryDetails;
                                  }
                              }
                          })
                          .error(function (response, status) {  //if request fail
                          });

            $scope.LoadState = function (val) {
                var CountryDetails = {
                    "token": $sessionStorage.APIToken,
                    "CountryId": val
                }


                var StateDetailsData = userdetailsFactory.get_StateDetails(CountryDetails)
                           .success(function (response, status) {  //if request successfull  
                               if (status === 200) {

                                   if (response.Message.isError === '1') {
                                       swal("LoadState", response.Message.errorMessage, "error");
                                   }
                                   else {
                                       $scope.StateList = response.StateDetails;
                                   }
                               }
                           })
                           .error(function (response, status) {  //if request fail
                           });
            };

            var TransactionDetailsData = forexFactory.get_NewCardDetailsByUserId(userIdDetails)
                          .success(function (response, status) {  //if request successfull  
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $scope.TransactionHistoryList = response.UserDetails;
                                      var keys = Object.keys(response.UserDetails);
                                      if (keys.length != 0) {
                                          $scope.TransactionDetailsDiv = false;
                                      }
                                      else {
                                          $scope.TransactionDetailsDiv = true;
                                      }
                                      $scope.bindTransactionDetailsTable('10', '4', $scope.TransactionHistoryList);
                                  }
                              }
                          })
                          .error(function (response, status) {  //if request fail
                          });

            var userdetailsData = userdetailsFactory.get_UserDetails(userIdDetails)
                          .success(function (response, status) {            //if details successfully get from server
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $scope.UserDetails = {
                                          'StudentId': response.UserDetails._id,
                                          'UserId': response.UserDetails.UserId._id,
                                          'Email': response.UserDetails.UserId.Email,
                                          'ContactNumber': response.UserDetails.UserId.ContactNumber,
                                          'LastName': response.UserDetails.UserId.LastName,
                                          'FirstName': response.UserDetails.UserId.FirstName,
                                          'Gender': response.UserDetails.Gender,
                                          'City': response.UserDetails.City,
                                          'Nationality': response.UserDetails.Nationality,
                                          'DOB': $filter('date')(response.UserDetails.DOB, "yyyy-MM-dd"),
                                          'AddressLine1': response.UserDetails.AddressLine1,
                                          'PassportFlag': response.UserDetails.PassportFlag,
                                          'PassportNumber': response.UserDetails.PassportNumber,
                                          'ForexCardFlag': response.UserDetails.ForexCardFlag,
                                          'ForexCardNumber': response.UserDetails.ForexCardNumber,
                                          'PanCardFlag': response.UserDetails.PanCardFlag,
                                          'PanCardNumber': response.UserDetails.PanCardNumber,
                                          'MotherName': response.UserDetails.MotherName,
                                          'Pincode': response.UserDetails.Pincode,
                                          'StateId': response.UserDetails.StateId,
                                          'CountryId': response.UserDetails.CountryId,
                                          'PassportIssueDate': $filter('date')(response.UserDetails.PassportIssueDate, "yyyy-MM-dd"),
                                          'PassportExpiryDate': $filter('date')(response.UserDetails.PassportExpiryDate, "yyyy-MM-dd")
                                      };

                                      if (response.UserDetails.CountryId !== undefined) {
                                          $scope.LoadState(response.UserDetails.CountryId);
                                      }
                                  }
                              }
                          })
                          .error(function (response, status) {  //if fail
                          });

            var DocumentsListData = userdetailsFactory.get_DocumentsList()
                          .success(function (response, status) {  //if request successfull  

                              if (status === 200) {

                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $scope.DocumentsList = response.DocumentType;
                                  }
                              }
                          })
                          .error(function (response, status) {  //if request fail
                          });

            var studentDetails = {
                "UserId": $sessionStorage.UserId,
                "token": $sessionStorage.APIToken
            };

            var userdetailsData = userdetailsFactory.get_UserDetails(studentDetails)
                          .success(function (response, status) {            //if details successfully posted to server
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {

                                      $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                      //$scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                      //$scope.DocumentDetailsList.push({ DocumentLink: DocumentUploadPath });
                                      var keys_DocumentDetailsList = Object.keys(response.UserDetails.studentDocument);
                                      if (keys_DocumentDetailsList.length != 0) {
                                          $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                          $scope.DocumentDetailsDiv = true;
                                      }
                                  }
                              }
                          })
                          .error(function (response, status) {  //if fail
                          });
        }

        $scope.bindDocumentDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.DocumentDetailsTable = new NgTableParams(
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

        $scope.uploadFile = function (frmDocUpload) {

            if (frmDocUpload.$valid) {
                if ($scope.myFile !== undefined) {
                    if ($scope.myFile !== null) {
                        $scope.loading = true;
                        $scope.IsDocumentUploadDetails = true;

                        var file = $scope.myFile;
                        var tokenDetails = {
                            "token": $sessionStorage.APIToken
                        };

                        var result = userdetailsFactory.uploadFileToUrl(file, tokenDetails)
                        .success(function (response, status) {            //if details successfully posted to server
                            if (status === 200) {
                                if (response.Message.isError === '1') {
                                    swal("", response.Message.errorMessage, "error");
                                    $scope.IsDocumentUploadDetails = false;
                                    $scope.loading = false;
                                }
                                else {

                                    var documentDetails = {
                                        "token": $sessionStorage.APIToken,
                                        "studentDetails": {
                                            "_id": $sessionStorage.StudentId,
                                            "UserId": $sessionStorage.UserId
                                        },

                                        "studentDocument": [{
                                            "DocumentName": file.name,
                                            "DocumentTypeId": $scope.DocumentDetails.DocumentTypeId,
                                            "DocumentPath": response.DocumentPath
                                        }
                                        ]
                                    };

                                    var doumentDetailsResult = userdetailsFactory.post_UserDetails(documentDetails)
                                        .success(function (response, status) {            //if details successfully posted to server

                                            if (status === 200) {
                                                if (response.Message.isError === '1') {
                                                    swal("", response.Message.errorMessage, "error");
                                                    $scope.loading = false;
                                                }
                                                else {

                                                    var studentDetails = {
                                                        "token": $sessionStorage.APIToken,
                                                        "UserId": $sessionStorage.UserId
                                                    };

                                                    var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                                 .success(function (response, status) {            //if details successfully posted to server

                                                                     if (status === 200) {
                                                                         if (response.Message.isError === '1') {
                                                                             swal("", response.Message.errorMessage, "error");
                                                                         }
                                                                         else {
                                                                             $("#fuDocumentUpload").val('');
                                                                             $scope.myFile = null;
                                                                             $scope.DocumentDetails = null;
                                                                             $scope.frmDocUpload.$setPristine();
                                                                             $scope.frmDocUpload.$setUntouched();
                                                                             $scope.IsDocumentUploadDetails = false;
                                                                             $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                                                             var keys = Object.keys(response.UserDetails.studentDocument);
                                                                             if (keys.length != 0) {
                                                                                 $scope.DocumentDetailsDiv = true;
                                                                             }
                                                                             else {
                                                                                 $scope.DocumentDetailsDiv = false;
                                                                             }
                                                                             $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                                                         }
                                                                     }
                                                                 })
                                                                 .error(function (response, status) {  //if fail
                                                                 });
                                                    $scope.loading = false;
                                                    swal("Upload!", "Your data has been uploaded", "success");
                                                }
                                            }
                                        })
                                }
                            }

                        })
                        .error(function (response, status) {  //if fail
                            console.log('Main Errorrr' + status);
                        });
                    }
                    else {
                        swal("", "Please select file to upload", "error");
                    }
                }
                else {
                    swal("", "Please select file to upload", "error");
                }
            }
        };

        $scope.DeleteDocumentDetails = function (id, docPath) {

            if (id !== undefined) {

                swal({
                    title: "Are you sure you want to delete?",
                    text: "You will not be able to recover this data!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {

                        var documentDetails = {
                            "token": $sessionStorage.APIToken,
                            "studentDetails": {
                                "_id": $sessionStorage.StudentId
                            },

                            "studentDocument": [
                             {
                                 "_id": id,
                                 "DocumentPath": docPath
                             }
                            ]
                        };
                        var result = userdetailsFactory.delete_UserDetails(documentDetails)
                              .success(function (response, status) {            //if successfully deleted 

                                  if (status === 200) {
                                      if (response.Message.isError === '1') {
                                          swal("", response.Message.errorMessage, "error");
                                      }
                                      else {
                                          var studentDetails = {
                                              "token": $sessionStorage.APIToken,
                                              "UserId": $sessionStorage.UserId
                                          };

                                          var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                       .success(function (response, status) {            //if details successfully posted to server

                                                           if (status === 200) {
                                                               if (response.Message.isError === '1') {
                                                                   swal("", response.Message.errorMessage, "error");
                                                               }
                                                               else {
                                                                   $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                                                   var keys = Object.keys(response.UserDetails.studentDocument);
                                                                   if (keys.length != 0) {
                                                                       $scope.DocumentDetailsDiv = true;
                                                                   }
                                                                   else {
                                                                       $scope.DocumentDetailsDiv = false;
                                                                   }
                                                                   $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                                               }
                                                           }
                                                       })
                                                       .error(function (response, status) {  //if fail
                                                       });
                                      }
                                  }
                              })
                              .error(function (response, status) {  //if fail
                              });
                        swal("Deleted!", "Your data has been deleted.", "success");
                    }
                });
            }
        };

        $scope.GetQuote = function (productTypeId, principal, currencyId, forexAmount) {

            if (productTypeId !== undefined && principal !== undefined && currencyId !== undefined && forexAmount !== undefined) {

                $scope.loading = true;

                var quoteDetails = {
                    "token": $sessionStorage.APIToken,
                    "CurrencyCode": $scope.ForexDetails.ForexCurrencyId.CurrencyCode
                };

                var ForeignExchangeDetails = forexFactory.get_ForexExchangeDetails(quoteDetails)
                       .success(function (response, status) {  //if request successfull  
                           if (status === 200) {
                               if (response.Message.isError === '1') {
                                   $scope.loading = false;
                                   swal("", response.Message.errorMessage, "error");
                               }
                               else {
                                   $scope.ForeignExchangeDetailsList = response.Quote;
                                   $scope.loading = false;
                               }
                           }
                           $scope.DivIsVisible = true;
                       })
                       .error(function (response, status) {  //if request fail
                       });
            }
            else {
                swal("", "Please fill data first", "error");
            }
        }

        $scope.CheckLogin_Click = function () {
            if ($sessionStorage.UserName === undefined) {
                $location.path('/login');
            }
            else {

                var loginDetails1 = {   // getting login details
                    'Email': $sessionStorage.Email1,
                    'password': $sessionStorage.password1
                };

                var lg = loginFactory.login(loginDetails1)
                        .success(function (response) {

                            if (response.user.Gender === undefined) {          //To redirect page after successful login
                                $location.path('/gender');
                            }
                            else if (response.user.City === undefined) {
                                $location.path('/live');
                            }
                            else if (response.user.Nationality === undefined) {
                                $location.path('/nationality');
                            }
                            else if (response.user.DOB === undefined) {
                                $location.path('/dob');
                            }
                            else if (response.user.AddressLine1 === undefined) {
                                $location.path('/address');
                            }
                            else if (response.user.PassportFlag === undefined) {
                                $location.path('/passport');
                            }
                            else if (response.user.PassportFlag === true && response.user.PassportNumber === undefined) {
                                $location.path('/passportno');
                            }
                            else if (response.user.ForexCardFlag === undefined) {
                                $location.path('/forexcard');
                            }
                            else if (response.user.ForexCardFlag === true && response.user.ForexCardNumber === undefined) {
                                $location.path('/forexcardno');
                            }
                            else if (response.user.PanCardFlag === undefined) {
                                $location.path('/pancard');
                            }
                            else if (response.user.PanCardFlag === true && response.user.PanCardNumber === undefined) {
                                $location.path('/pancardno');
                            }
                            else {
                                $location.path('/remittanceorder');
                            }

                            //$window.location.reload(); //To refresh page after getting session values
                        })
                        .error(function (response) {  //if login fail
                        });
            }
        }

        $scope.UpdateRemittanceOrder_Click = function () {

            $scope.loading = true;
            $scope.IsOrderDisbale = true;

            $scope.RemittanceOrder = {
                "token": $sessionStorage.APIToken,
                "OrderDetails": {
                    "UserId": $sessionStorage.UserId,
                    "DeliveryOptions": null,
                    "CardDeliveryLocation": null,
                    "PaymentMode": $scope.NewCardDetails.PaymentMode,
                    "ProductTypeId": $scope.NewCardDetails.ProductTypeId
                },

                "RemittanceDetails": {
                    "RemittanceType": $scope.Beneficiarydetails.RemittanceType,
                    "BeneficiaryName": $scope.Beneficiarydetails.BeneficiaryName,
                    "BeneficiaryBankName": $scope.Beneficiarydetails.BeneficiaryBankName,
                    "BeneficiaryBankAddress": $scope.Beneficiarydetails.BeneficiaryBankAddress,
                    "BeneficiaryAccNo": $scope.Beneficiarydetails.BeneficiaryAccNo,
                    "SwiftDetails": $scope.Beneficiarydetails.SwiftDetails,
                    "BeneficiaryAddress": $scope.Beneficiarydetails.BeneficiaryAddress
                },

                "userDetails": {     //Array only to update below fileds
                    "_id": $sessionStorage.UserId,
                    "FirstName": $scope.UserDetails.FirstName,
                    "LastName": $scope.UserDetails.LastName
                    //"ContactNumber": $scope.UserDetails.ContactNumber,
                    //"Email": $scope.UserDetails.Email
                },

                "studentDetails": {
                    "_id": $sessionStorage.StudentId,
                    "UserId": $sessionStorage.UserId,
                    "FirstName": $scope.UserDetails.FirstName,
                    "LastName": $scope.UserDetails.LastName,
                    "ContactNumber": $scope.UserDetails.ContactNumber,
                    "Email": $scope.UserDetails.Email,
                    "Gender": $scope.UserDetails.Gender,
                    "DOB": $scope.UserDetails.DOB,
                    "MotherName": $scope.UserDetails.MotherName,
                    "Nationality": $scope.UserDetails.Nationality,
                    "Pincode": $scope.UserDetails.Pincode,
                    "City": $scope.UserDetails.City,
                    "StateId": $scope.UserDetails.StateId,
                    "CountryId": $scope.UserDetails.CountryId,
                    "PassportNumber": $scope.UserDetails.PassportNumber,
                    "PassportIssueDate": $scope.UserDetails.PassportIssueDate,
                    "PassportExpiryDate": $scope.UserDetails.PassportExpiryDate,
                    "PanCardNumber": $scope.UserDetails.PanCardNumber,
                    "AddressLine1": $scope.UserDetails.AddressLine1,
                    "ForexCardNumber": $scope.UserDetails.ForexCardNumber
                },

                "StudentTravelDetails": [
                    {
                        "UserId": $sessionStorage.UserId,
                        "TravelDate": $scope.TravelDetails.TravelDate,
                        "TravelDays": $scope.TravelDetails.TravelDays,
                        "PlaceOfVisitId": $scope.TravelDetails.PlaceOfVisitId,
                        "PurposeOfVisit": $scope.TravelDetails.PurposeOfVisit,
                        "TypeOfVisit": $scope.TravelDetails.TypeofVisit,
                        "PlaceOfVisit": $scope.TravelDetails.PlaceOfVisitId.CountryName
                    }
                ],
                "ForexDetails": [
                {
                    "Principal": $scope.ForexDetails.Principal,
                    "ForexAmount": $scope.ForexDetails.ForexAmount,
                    "ForexRate": $scope.ForexCalculationDetails.Forexrate,
                    "INRAmount": $scope.ForexCalculationDetails.FinalAmount,
                    "ForexCurrencyId": $scope.ForexDetails.ForexCurrencyId,
                    "CurrencyCode": $scope.ForexDetails.ForexCurrencyId.CurrencyCode
                }
                ]
            };

            var result = forexFactory.post_NewCardDetails($scope.RemittanceOrder)
               .success(function (response, status) {            //if new card details successfully posted to server
                   if (status === 200) {
                       if (response.Message.isError === '1') {
                           $scope.loading = true;
                           swal("", response.Message.errorMessage, "error");
                       }
                       else {
                           $scope.loading = true;
                           $location.path('/foreignexchange');  //To redirect page after successful call
                           swal("Thank You...!", "Your order has been confirmed successfully", "success");
                       }
                   }
               })
               .error(function (response, status) {  //if fail
               });
        };

        $scope.UpdateNewCardDetails_Click = function () {

            $scope.loading = true;
            $scope.IsOrderDisbale = true;

            if ($scope.IsCardReload === true) {

                $scope.UpdateNewCard = {
                    "token": $sessionStorage.APIToken,
                    "OrderDetails": {
                        "UserId": $sessionStorage.UserId,
                        "DeliveryOptions": $scope.NewCardDetails.DeliveryOptions,
                        "CardDeliveryLocation": $scope.NewCardDetails.CardDeliveryLocation,
                        "PaymentMode": $scope.NewCardDetails.PaymentMode,
                        "ProductTypeId": $scope.NewCardDetails.ProductTypeId
                    },

                    "userDetails": {     //Array only to update below fileds
                        "_id": $sessionStorage.UserId,
                        "FirstName": $scope.UserDetails.FirstName,
                        "LastName": $scope.UserDetails.LastName
                        //"ContactNumber": $scope.UserDetails.ContactNumber,
                        //"Email": $scope.UserDetails.Email
                    },


                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "UserId": $sessionStorage.UserId,
                        "FirstName": $scope.UserDetails.FirstName,
                        "LastName": $scope.UserDetails.LastName,
                        "ContactNumber": $scope.UserDetails.ContactNumber,
                        "Email": $scope.UserDetails.Email,
                        "Gender": $scope.UserDetails.Gender,
                        "DOB": $scope.UserDetails.DOB,
                        "MotherName": $scope.UserDetails.MotherName,
                        "Nationality": $scope.UserDetails.Nationality,
                        "Pincode": $scope.UserDetails.Pincode,
                        "City": $scope.UserDetails.City,
                        "StateId": $scope.UserDetails.StateId,
                        "CountryId": $scope.UserDetails.CountryId,
                        "PassportNumber": $scope.UserDetails.PassportNumber,
                        "PassportIssueDate": $scope.UserDetails.PassportIssueDate,
                        "PassportExpiryDate": $scope.UserDetails.PassportExpiryDate,
                        "PanCardNumber": $scope.UserDetails.PanCardNumber,
                        "AddressLine1": $scope.UserDetails.AddressLine1
                    },

                    "StudentTravelDetails": [
                        {
                            //"_id": null,
                            "UserId": $sessionStorage.UserId,
                            "TravelDate": $scope.TravelDetails.TravelDate,
                            "TravelDays": $scope.TravelDetails.TravelDays,
                            "PlaceOfVisitId": $scope.TravelDetails.PlaceOfVisitId,
                            "PurposeOfVisit": $scope.TravelDetails.PurposeOfVisit,
                            "PlaceOfVisit": $scope.TravelDetails.PlaceOfVisitId.CountryName
                        }
                    ],
                    "ForexDetails": [
                    {
                        "Principal": $scope.ForexDetails.Principal,
                        "ForexAmount": $scope.ForexDetails.ForexAmount,
                        "ForexRate": $scope.ForexCalculationDetails.Forexrate,
                        "INRAmount": $scope.ForexCalculationDetails.FinalAmount,
                        "ForexCurrencyId": $scope.ForexDetails.ForexCurrencyId,
                        "CurrencyCode": $scope.ForexDetails.ForexCurrencyId.CurrencyCode
                    }
                    ]
                };
            }
            else {
                $scope.UpdateNewCard = {
                    "token": $sessionStorage.APIToken,
                    "OrderDetails": {
                        "UserId": $sessionStorage.UserId,
                        "DeliveryOptions": $scope.NewCardDetails.DeliveryOptions,
                        "CardDeliveryLocation": $scope.NewCardDetails.CardDeliveryLocation,
                        "PaymentMode": $scope.NewCardDetails.PaymentMode,
                        "ProductTypeId": $scope.NewCardDetails.ProductTypeId
                    },

                    "userDetails": {     //Array only to update below fields
                        "_id": $sessionStorage.UserId,
                        "FirstName": $scope.UserDetails.FirstName,
                        "LastName": $scope.UserDetails.LastName
                        //"ContactNumber": $scope.UserDetails.ContactNumber,
                        //"Email": $scope.UserDetails.Email
                    },


                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "UserId": $sessionStorage.UserId,
                        "FirstName": $scope.UserDetails.FirstName,
                        "LastName": $scope.UserDetails.LastName,
                        "ContactNumber": $scope.UserDetails.ContactNumber,
                        "Email": $scope.UserDetails.Email,
                        "Gender": $scope.UserDetails.Gender,
                        "DOB": $scope.UserDetails.DOB,
                        "MotherName": $scope.UserDetails.MotherName,
                        "Nationality": $scope.UserDetails.Nationality,
                        "Pincode": $scope.UserDetails.Pincode,
                        "City": $scope.UserDetails.City,
                        "StateId": $scope.UserDetails.StateId,
                        "CountryId": $scope.UserDetails.CountryId,
                        "PassportNumber": $scope.UserDetails.PassportNumber,
                        "PassportIssueDate": $scope.UserDetails.PassportIssueDate,
                        "PassportExpiryDate": $scope.UserDetails.PassportExpiryDate,
                        "PanCardNumber": $scope.UserDetails.PanCardNumber,
                        "AddressLine1": $scope.UserDetails.AddressLine1,
                        "ForexCardNumber": $scope.UserDetails.ForexCardNumber
                    },

                    "StudentTravelDetails": [
                        {
                            //"_id": null,
                            "UserId": $sessionStorage.UserId,
                            "TravelDate": $scope.TravelDetails.TravelDate,
                            "TravelDays": $scope.TravelDetails.TravelDays,
                            "PlaceOfVisitId": $scope.TravelDetails.PlaceOfVisitId,
                            "PurposeOfVisit": $scope.TravelDetails.PurposeOfVisit,
                            "TypeOfVisit": $scope.TravelDetails.TypeofVisit,
                            "PlaceOfVisit": $scope.TravelDetails.PlaceOfVisitId.CountryName
                        }
                    ],
                    "ForexDetails": [
                    {
                        "Principal": $scope.ForexDetails.Principal,
                        "ForexAmount": $scope.ForexDetails.ForexAmount,
                        "ForexRate": $scope.ForexCalculationDetails.Forexrate,
                        "INRAmount": $scope.ForexCalculationDetails.FinalAmount,
                        "ForexCurrencyId": $scope.ForexDetails.ForexCurrencyId,
                        "CurrencyCode": $scope.ForexDetails.ForexCurrencyId.CurrencyCode
                    }
                    ]
                };
            }

            var result = forexFactory.post_NewCardDetails($scope.UpdateNewCard)
                .success(function (response, status) {            //if new card details successfully posted to server
                    if (status === 200) {
                        if (response.Message.isError === '1') {
                            $scope.loading = false;
                            swal("", response.Message.errorMessage, "error");
                        }
                        else {
                            $scope.loading = false;
                            $location.path('/foreignexchange');  //To redirect page after successful call
                            swal("Thank You...!", "Your order has been confirmed successfully", "success");
                        }
                    }
                })
                .error(function (response, status) {  //if fail
                });
        };

        $scope.ApplyRates = function (currencyId, forexAmount, forexrate, totalAmount) {

            if (currencyId !== undefined && forexAmount !== undefined && forexrate !== undefined && totalAmount !== undefined) {

                var currency = angular.toJson($scope.CurrencyList.filter(
                    function (data) { return data._id == currencyId }
                )[0]);

                currency = $scope.strToJson(currency);

                $scope.ForexCalculationDetails = {
                    'CurrencyName': currency.CurrencyName,
                    'ForexAmount': forexAmount,
                    'Forexrate': forexrate,
                    'TotalAmount': totalAmount
                }
                $scope.tab = 2;  //To redirect page after successful call
                $('#liTab1').removeClass('active');
                $('#liTab2').addClass('active');
            }
            else {
                swal("", "Please fill require fields & then click on apply button", "error");
            }
        }

        $scope.setPageName = function (pagename) {
            $sessionStorage.SessionPageName = pagename;
        };

        $scope.strToJson = function (strObj) {

            var jsonObj = {};

            var objLength = strObj.replace('{', '').replace('}', '').split(',').length;
            var objValue = strObj.replace('{', '').replace('}', '').split(',');

            for (var i = 0; i < objLength; i++) {
                var eleValue = strObj.replace('{', '').replace('}', '').split(',')[i];
                var columnName = eleValue.split(':')[0].replace('"', '').replace('"', '');
                jsonObj[columnName] = eleValue.split(':')[1].replace('"', '').replace('"', '');
            }
            return jsonObj;
        };

        $scope.PersonalDetailsClick = function (frmPersonaldetails) {

            if (frmPersonaldetails.$valid) {
                $scope.tab = 4;  //To redirect page after successful call
                $('#liTab3').removeClass('active');
                $('#liTab4').addClass('active');
            }
        };

        $scope.TravellerDetailsClick = function (frmTravellerdetails, PassportIssueDate, PassportExpiryDate) {

            if (frmTravellerdetails.$valid) {

                if (PassportIssueDate < PassportExpiryDate) {
                    $scope.tab = 5;  //To redirect page after successful call
                    $('#liTab4').removeClass('active');
                    $('#liTab5').addClass('active');
                }
                else {
                    swal("", "Passport expiry date should be greater than passport issue date", "error");
                }
            }
        };

        $scope.BeneficaryDetailsClick = function (frmBeneficiarydetails) {

            if (frmBeneficiarydetails.$valid) {
                $scope.tab = 7;  //To redirect page after successful call
                $('#liTab6').removeClass('active');
                $('#liTab7').addClass('active');
            }
        };

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

        $scope.DocumentUploadSkipClick = function () {

            $scope.tab = 6;  //To redirect page after successful call
            $('#liTab5').removeClass('active');
            $('#liTab6').addClass('active');

        };

        //Code for sorting 
        $scope.SortGrievanceDtlsBy = 'TicketNumber';
        $scope.reverseGrievanceDtls = false;
        $scope.sortGrievanceDetails = function (columnName) {
            $scope.SortGrievanceDtlsBy = columnName;
            $scope.reverseGrievanceDtls = !$scope.reverseGrievanceDtls;
        };

        $scope.SortTransactionDtlsBy = 'OrderId';
        $scope.reverseTransactionDtls = true;
        $scope.sortTransactionDetails = function (columnName) {
            $scope.SortTransactionDtlsBy = columnName;
            $scope.reverseTransactionDtls = !$scope.reverseTransactionDtls;
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
},{}],4:[function(require,module,exports){
/**
 * Created by Rahul S on 30-05-2016.
 */
var module_name = 'app.forex';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name,[]);
},{}],5:[function(require,module,exports){
/**
 * Created by Rahul S on 3-10-2016.
 */

(function () {
    'use strict';

    angular
        .module('app.grievance')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider
             .when('/grievance', {
                 templateUrl: 'app/modules/grievance/views/grievance.html',
                 controller: 'grievance.controller',
                 resolve: {
                 }
             })
            .when('/grievancelist', {
                templateUrl: 'app/modules/grievance/views/grievancelist.html',
                controller: 'grievance.controller',
                resolve: {
                }
            });
    }
})();
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
/**
 * Created by Rahul S on 3-10-2016.
 */
var module_name = 'app.grievance';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name, []);
},{}],8:[function(require,module,exports){
/**
 * Created by rahuls on 30-05-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.home')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

        .when('/', {
            templateUrl: 'app/modules/home/views/home.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/comingsoon', {
            templateUrl: 'app/modules/home/views/comingsoon.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/resetpassword/:token', {
            templateUrl: 'app/modules/home/views/resetpassword.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/changepassword', {
            templateUrl: 'app/modules/home/views/changepassword.html',
            controller: 'home.controller',
            resolve: {
            }
        });
    }
})();
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
/**
 * Created by Rahul S on 30-05-2016.
 */
var module_name = 'app.home';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name,[]);
},{}],11:[function(require,module,exports){
/**
 * Created by rahuls on 27-05-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.login')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider
            .when('/login', {
                templateUrl: 'app/modules/login/views/login.html',
                controller: 'login.controller',
                resolve: {
                }
            });
    }
})();
},{}],12:[function(require,module,exports){
/*** Created by Rahul Salve on 26/5/2016. */

(function () {
    'use strict';

    function loginController($scope, $location, loginFactory, cookiesService, $localStorage, $sessionStorage, $route, $window, $rootScope, Host, Idle, Keepalive) {

        $scope.IsRemember = false;
        $scope.started = false;

        if ($sessionStorage.idelWatch === true) {  //It checked idelWatch is on or off.
            Idle.watch();
            $scope.started = $sessionStorage.idelWatch;
        }

        if ((cookiesService.getCookie('UserNameCookie') != undefined) && (cookiesService.getCookie('PasswordCookie') != undefined)) {
            $scope.IsRemember = true;
            var UName = cookiesService.getCookie('UserNameCookie');
            var UPass = cookiesService.getCookie('PasswordCookie');
            var decryptedUName2 = CryptoJS.AES.decrypt(UName, $rootScope.base64Key, { iv: $rootScope.iv });
            $scope.descrStringUName2 = decryptedUName2.toString(CryptoJS.enc.Utf8);

            var decryptedUPass2 = CryptoJS.AES.decrypt(UPass, $rootScope.base64Key, { iv: $rootScope.iv });
            $scope.descrStringUPass2 = decryptedUPass2.toString(CryptoJS.enc.Utf8);
            $scope.Username = $scope.descrStringUName2;
            $scope.Password = $scope.descrStringUPass2;
        }

        if ($sessionStorage.UserName === undefined) {
            $location.path('/login');
        }
        else {

            var loginDetails1 = {   // getting login details
                'Email': $sessionStorage.Email1,
                'password': $sessionStorage.password1
            };

            var lg = loginFactory.login(loginDetails1)
                    .success(function (response) {

                        if (response.user.Gender === undefined) {          //To redirect page after successful login
                            $location.path('/gender');
                        }
                        else if (response.user.City === undefined) {
                            $location.path('/live');
                        }
                        else if (response.user.Nationality === undefined) {
                            $location.path('/nationality');
                        }
                        else if (response.user.DOB === undefined) {
                            $location.path('/dob');
                        }
                        else if (response.user.AddressLine1 === undefined) {
                            $location.path('/address');
                        }
                        else if (response.user.PassportFlag === undefined) {
                            $location.path('/passport');
                        }
                        else if (response.user.PassportFlag === true && response.user.PassportNumber === undefined) {
                            $location.path('/passportno');
                        }
                        else if (response.user.ForexCardFlag === undefined) {
                            $location.path('/forexcard');
                        }
                        else if (response.user.ForexCardFlag === true && response.user.ForexCardNumber === undefined) {
                            $location.path('/forexcardno');
                        }
                        else if (response.user.PanCardFlag === undefined) {
                            $location.path('/pancard');
                        }
                        else if (response.user.PanCardFlag === true && response.user.PanCardNumber === undefined) {
                            $location.path('/pancardno');
                        }
                        else {
                            $location.path('/');
                        }
                        //$window.location.reload(); //To refresh page after getting session values
                    })
                    .error(function (response) {  //if login fail
                    });
        }

        $scope.Login_Click = function () {

            if ($scope.Username != null && $scope.Password != null) {

                $scope.loading = true;

                var loginDetails = {   // getting login details
                    'Email': $scope.Username,
                    'password': $scope.Password
                };

                // ************************************ Encrypted Text ************************************

                var encryptedUname = CryptoJS.AES.encrypt(
                          $scope.Username,
                          $rootScope.base64Key,
                          { iv: $rootScope.iv });

                $scope.ciphertextUName = encryptedUname.ciphertext.toString(CryptoJS.enc.Base64);

                var cipherParamsUName = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse($scope.ciphertextUName)
                });


                var encryptedUPass = CryptoJS.AES.encrypt(
                          $scope.Password,
                          $rootScope.base64Key,
                          { iv: $rootScope.iv });

                $scope.ciphertextUPass = encryptedUPass.ciphertext.toString(CryptoJS.enc.Base64);

                var cipherParamsUPass = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse($scope.ciphertextUPass)
                });


                // ************************************** Decrypted Text ************************************

                var decryptedUName = CryptoJS.AES.decrypt(
                           cipherParamsUName,
                           $rootScope.base64Key,
                           { iv: $rootScope.iv });
                $scope.descrStringUName = decryptedUName.toString(CryptoJS.enc.Utf8);

                var decryptedUPass = CryptoJS.AES.decrypt(
                       cipherParamsUPass,
                       $rootScope.base64Key,
                       { iv: $rootScope.iv });
                $scope.descrStringUPass = decryptedUName.toString(CryptoJS.enc.Utf8);

                /**************************** Cookies Part **************************************/
                if ($scope.RememberMe) {//Check if remember me is selected or not
                    if ((cookiesService.getCookie('UserNameCookie') === undefined) && (cookiesService.getCookie('PasswordCookie') === undefined)) {//create new cookies
                        cookiesService.putCookie('UserNameCookie', $scope.ciphertextUName);
                        cookiesService.putCookie('PasswordCookie', $scope.ciphertextUPass);
                    }
                    if (cookiesService.getCookie('UserNameCookie') != $scope.descrStringUName) {//Replace cookies values
                        cookiesService.putCookie('UserNameCookie', $scope.ciphertextUName);
                        cookiesService.putCookie('PasswordCookie', $scope.ciphertextUPass);
                    }
                }
                else {
                    cookiesService.removeCookie('UserNameCookie');
                    cookiesService.removeCookie('PasswordCookie');
                }

                var lg = loginFactory.login(loginDetails)
                      .success(function (response, status) {            //if login success
                          if (status === 200) {

                              if (response.Message.isError === '1') {
                                  $scope.loading = false;
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {

                                  Idle.watch();
                                  $scope.started = true;
                                  $sessionStorage.idelWatch = $scope.started;
                                  $sessionStorage.APIToken = response.Token,
                                  $sessionStorage.UserName = response.user.FirstName;
                                  $sessionStorage.UserFullName = response.user.FirstName + " " + response.user.LastName;
                                  $sessionStorage.IsUserLoggedIn = "true";
                                  $sessionStorage.ShowJoinUs = "false";

                                  $sessionStorage.Email1 = $scope.Username;
                                  $sessionStorage.password1 = $scope.Password;

                                  if (response.user.UserId === undefined) {
                                      $sessionStorage.UserId = response.user._id;
                                  }
                                  else {
                                      $sessionStorage.UserId = response.user.UserId;
                                      $sessionStorage.StudentId = response.user._id;
                                  }

                                  if (response.user.Gender === undefined) {          //To redirect page after successful login
                                      $location.path('/gender');
                                  }
                                  else if (response.user.City === undefined) {
                                      $location.path('/live');
                                  }
                                  else if (response.user.Nationality === undefined) {
                                      $location.path('/nationality');
                                  }
                                  else if (response.user.DOB === undefined) {
                                      $location.path('/dob');
                                  }
                                  else if (response.user.AddressLine1 === undefined) {
                                      $location.path('/address');
                                  }
                                  else if (response.user.PassportFlag === undefined && response.user.PassportNumber === undefined) {
                                      $location.path('/passport');
                                  }
                                  else if (response.user.PassportFlag === true && response.user.PassportNumber === undefined) {
                                      $location.path('/passportno');
                                  }
                                  else if (response.user.ForexCardFlag === undefined && response.user.ForexCardNumber === undefined) {
                                      $location.path('/forexcard');
                                  }
                                  else if (response.user.ForexCardFlag === true && response.user.ForexCardNumber === undefined) {
                                      $location.path('/forexcardno');
                                  }
                                  else if (response.user.PanCardFlag === undefined && response.user.PanCardNumber === undefined) {
                                      $location.path('/pancard');
                                  }
                                  else if (response.user.PanCardFlag === true && response.user.PanCardNumber === undefined) {
                                      $location.path('/pancardno');
                                  }
                                  else {
                                      $location.path('/');
                                  }

                                  $scope.loading = false;
                                  $window.location.reload(); //To refresh page after getting session values
                              }
                          }
                      })
                      .error(function (response, status) {  //if login fail
                          $sessionStorage.IsUserLoggedIn = "false";
                          $sessionStorage.ShowJoinUs = "true";
                          $scope.loading = false;
                          if (status === 404)
                              swal("", "Please check internet connection", "error");
                          else
                              swal("", "Something went wrong", "error");
                      });
            }
            else {
                swal("", "Please enter valid credential", "error");
            }
        };

        $scope.Registration_Click = function () {

            if ($scope.FirstName != null && $scope.LastName != null && $scope.ContactNumber != null && $scope.Email != null && $scope.ConfirmPassword != null) {
                $scope.loading = true;
                var registartion = {
                    "FirstName": $scope.FirstName,
                    "LastName": $scope.LastName,
                    "ContactNumber": $scope.ContactNumber,
                    "City": "",
                    "Email": $scope.Email,
                    "Password": $scope.ConfirmPassword
                };

                var result = loginFactory.registration(registartion)
                    .success(function (response, status) {

                        if (status === 200) {

                            if (response.Message.isError === '1') {
                                $scope.loading = false;
                                swal("", response.Message.errorMessage, "error");
                            }
                            else {
                                $scope.FirstName = '';
                                $scope.LastName = '';
                                $scope.ContactNumber = '';
                                $scope.Email = '';
                                $scope.NewPassword = '';
                                $scope.ConfirmPassword = '';
                                $("#frmregistration").addClass("register-form");
                                $("#frmforgotpassword").removeClass("register-form");
                                $("#frmlogin").removeClass("login-form");
                                $scope.loading = false;
                                swal("", "Registration Successful", "success");
                            }
                        }
                    })
                    .error(function (response, status) {
                        $scope.loading = false;
                        if (status === 404)
                            swal("", "Please check internet connection", "error");
                        else
                            swal("", "Something went wrong", "error");
                    });
            }
        };

        $scope.ForgotPassword_Click = function () {

            if ($scope.ForgotEmail != null) {
                $scope.loading = true;
                var forgotpassword = {
                    "host": Host,
                    "Email": $scope.ForgotEmail,
                };

                var result = loginFactory.forgotpassword(forgotpassword)
                    .success(function (response, status) {
                        if (status === 200) {
                            if (response.Message.isError === '1') {
                                swal("", response.Message.errorMessage, "error");
                            }
                            else {
                                $scope.loading = false;
                                swal("", "Plese check your mail for password reset link", "success");
                                $scope.ForgotEmail = null;
                                $location.path('/login');
                            }
                        }
                    })
                    .error(function (response, status) {
                        $scope.loading = false;
                        swal("", "Something went wrong", "error");
                    });
            }
            else {
                swal("", "Please fill required fields", "error");
            }
        };

        $scope.CheckLogin_Click = function () {
            if ($sessionStorage.UserName === undefined) {
                $location.path('/login');
            }
            else {
                $scope.loading = true;
                var loginDetails1 = {   // getting login details
                    'Email': $sessionStorage.Email1,
                    'password': $sessionStorage.password1
                };

                var lg = loginFactory.login(loginDetails1)
                        .success(function (response) {

                            if (response.user.Gender === undefined) { //To redirect page after successful login
                                $location.path('/gender');
                            }
                            else if (response.user.City === undefined) {
                                $location.path('/live');
                            }
                            else if (response.user.Nationality === undefined) {
                                $location.path('/nationality');
                            }
                            else if (response.user.DOB === undefined) {
                                $location.path('/dob');
                            }
                            else if (response.user.AddressLine1 === undefined) {
                                $location.path('/address');
                            }
                            else if (response.user.PassportFlag === undefined && response.user.PassportNumber === undefined) {
                                $location.path('/passport');
                            }
                            else if (response.user.PassportFlag === true && response.user.PassportNumber === undefined) {
                                $location.path('/passportno');
                            }
                            else if (response.user.ForexCardFlag === undefined && response.user.ForexCardNumber === undefined) {
                                $location.path('/forexcard');
                            }
                            else if (response.user.ForexCardFlag === true && response.user.ForexCardNumber === undefined) {
                                $location.path('/forexcardno');
                            }
                            else if (response.user.PanCardFlag === undefined && response.user.PanCardNumber === undefined) {
                                $location.path('/pancard');
                            }
                            else if (response.user.PanCardFlag === true && response.user.PanCardNumber === undefined) {
                                $location.path('/pancardno');
                            }
                            else {
                                $location.path('/');
                            }
                            $scope.loading = false;
                        })
                        .error(function (response) {  //if login fail
                            $scope.loading = false;
                        });
            }
        }

        $scope.showforgot = function () {
            $("#frmforgotpassword").removeClass("forgotpassword-form");
            $("#frmregistration").addClass("register-form");
            $("#frmlogin").addClass("login-form");
        };

        $scope.showlogin = function () {
            $("#frmforgotpassword").addClass("forgotpassword-form");
            $("#frmregistration").addClass("register-form");
            $("#frmlogin").removeClass("login-form");
        };

        $scope.showRegistration = function () {
            $("#frmforgotpassword").addClass("forgotpassword-form");
            $("#frmregistration").removeClass("register-form");
            $("#frmlogin").addClass("login-form");
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
            $scope.loading = false;
            $location.path('/login');    //To redirect page after successful login
            $window.location.reload(); //To refresh page after getting session values
            swal("Opssss...Session expired", "Due to inactivity, your session has timed out & no longer active", "error");
        });
    };

    angular.module('app.login').run(function (cfCryptoHttpInterceptor, $rootScope) {
        $rootScope.base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
        $rootScope.iv = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    })

    loginController.$inject = ['$scope', '$location', 'loginFactory', 'cookiesService', '$localStorage', '$sessionStorage', '$route', '$window', '$rootScope', 'Host', 'Idle', 'Keepalive'];
    angular.module('app.login').controller('login.controller', loginController);

})();
},{}],13:[function(require,module,exports){
/**
 * Created by Rahul S on 27-05-2016.
 */
var module_name = 'app.login';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name,[]);
},{}],14:[function(require,module,exports){
/**
 * Created by Rahul S on 3-10-2016.
 */

(function () {
    'use strict';

    angular
        .module('app.transaction')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

            .when('/transactionhistory', {
                templateUrl: 'app/modules/transaction/views/transactionhistory.html',
                controller: 'transaction.controller',
                resolve: {
                }
            });
    }
})();
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
/**
 * Created by Rahul S on 3-10-2016.
 */
var module_name = 'app.transaction';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name, []);
},{}],17:[function(require,module,exports){
/**
 * Created by rahuls on 15-06-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.userdetails')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

            .when('/gender', {
                templateUrl: 'app/modules/userdetails/views/userdetails_gender.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/live', {
                templateUrl: 'app/modules/userdetails/views/userdetails_live.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/nationality', {
                templateUrl: 'app/modules/userdetails/views/userdetails_nationality.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/name', {
                templateUrl: 'app/modules/userdetails/views/userdetails_name.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/dob', {
                templateUrl: 'app/modules/userdetails/views/userdetails_dob.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/contact', {
                templateUrl: 'app/modules/userdetails/views/userdetails_contact.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/address', {
                templateUrl: 'app/modules/userdetails/views/userdetails_address.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/passport', {
                templateUrl: 'app/modules/userdetails/views/userdetails_passport.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/passportno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_passportno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/forexcard', {
                templateUrl: 'app/modules/userdetails/views/userdetails_forexcard.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/forexcardno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_forexcardno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/pancard', {
                templateUrl: 'app/modules/userdetails/views/userdetails_pancard.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/pancardno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_pancardno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/userprofile', {
                templateUrl: 'app/modules/userdetails/views/userprofile.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            });
    }
})();

},{}],18:[function(require,module,exports){
/**
 * Created by Rahul Salve on 15-06-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.userdetails')
        .controller('userdetails.controller', userdetailsController);

    userdetailsController.$inject = ['$scope', 'cookiesService', '$sessionStorage', '$route', '$window', 'userdetailsFactory', '$location', '$filter', 'loginFactory', 'DocumentUploadPath', 'Idle', 'Keepalive', 'NgTableParams'];

    function userdetailsController($scope, cookiesService, $sessionStorage, $route, $window, userdetailsFactory, $location, $filter, loginFactory, DocumentUploadPath, Idle, Keepalive, NgTableParams) {

        //Global variable declaration
        $scope.EducationDetailsList;
        $scope.ProfessionalDetailsList;
        $scope.DocumentDetailsList;
        $scope.BankDetailsList;
        $scope.btnAddEducationDetails = 'Save';
        $scope.btnAddProfessionalDetails = 'Save';
        $scope.btnAddBankDetails = 'Save';
        $scope.EducationDetails = { '_id': null }
        $scope.ProfessionalDetails = { '_id': null }
        $scope.BankDetails = { '_id': null }
        $scope.IsPersonalDetails = false;
        $scope.IsEducationalDetails = false;
        $scope.IsProfessionalDetails = false;
        $scope.DocumentLink = DocumentUploadPath;
        $scope.IsDocumentUploadDetails = false;
        $scope.IsBankDetails = false;
        $scope.EducationDetailsDiv = false;
        $scope.ProfessionalDetailsDiv = false;
        $scope.BankDetailsDiv = false;
        $scope.DocumentDetailsDiv = false;

        if ($sessionStorage.UserId === undefined) {  //It checked user is logged in or not. If not then redirect to login
            $location.path('/login');
        }

        if ($sessionStorage.idelWatch === true) {  //It checked idelWatch is on or off.
            Idle.watch();
            $scope.started = $sessionStorage.idelWatch;
        }

        var CountryDetailsData = userdetailsFactory.get_CountryDetails()
                      .success(function (response, status) {  //if request successfull  
                          if (status === 200) {

                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $scope.CountryList = response.CountryDetails;
                              }
                          }
                      })
                      .error(function (response, status) {  //if request fail
                      });

        var DocumentsListData = userdetailsFactory.get_DocumentsList()
                    .success(function (response, status) {  //if request successfull  

                        if (status === 200) {

                            if (response.Message.isError === '1') {
                                swal("", response.Message.errorMessage, "error");
                            }
                            else {
                                $scope.DocumentsList = response.DocumentType;
                            }
                        }
                    })
                    .error(function (response, status) {  //if request fail
                    });

        var ProductsListData = userdetailsFactory.get_ProductsList()
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

        $scope.LoadState = function (val) {

            $scope.UserDetails.StateId = null;

            var CountryDetails = {
                "token": $sessionStorage.APIToken,
                "CountryId": val
            }

            var StateDetailsData = userdetailsFactory.get_StateDetails(CountryDetails)
                       .success(function (response, status) {  //if request successfull  
                           if (status === 200) {

                               if (response.Message.isError === '1') {
                                   swal("", response.Message.errorMessage, "error");
                               }
                               else {
                                   $scope.StateList = response.StateDetails;
                               }
                           }
                       })
                       .error(function (response, status) {  //if request fail
                       });
        };

        var studentDetails = {
            "UserId": $sessionStorage.UserId,
            "token": $sessionStorage.APIToken
        };

        console.log(JSON.stringify(studentDetails));
        var userdetailsData = userdetailsFactory.get_UserDetails(studentDetails)
                      .success(function (response, status) {            //if details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {

                                  $scope.UserDetails = {
                                      'StudentId': response.UserDetails._id,
                                      'UserId': response.UserDetails.UserId._id,
                                      'Email': response.UserDetails.UserId.Email,
                                      'ContactNumber': response.UserDetails.UserId.ContactNumber,
                                      'LastName': response.UserDetails.UserId.LastName,
                                      'FirstName': response.UserDetails.UserId.FirstName,
                                      'Gender': response.UserDetails.Gender,
                                      'City': response.UserDetails.City,
                                      'Nationality': response.UserDetails.Nationality,
                                      'DOB': $filter('date')(response.UserDetails.DOB, "yyyy-MM-dd"),
                                      'AddressLine1': response.UserDetails.AddressLine1,
                                      'PassportFlag': response.UserDetails.PassportFlag,
                                      'PassportNumber': response.UserDetails.PassportNumber,
                                      'ForexCardFlag': response.UserDetails.ForexCardFlag,
                                      'ForexCardNumber': response.UserDetails.ForexCardNumber,
                                      'PanCardFlag': response.UserDetails.PanCardFlag,
                                      'PanCardNumber': response.UserDetails.PanCardNumber,
                                      'MotherName': response.UserDetails.MotherName,
                                      'Pincode': response.UserDetails.Pincode,
                                      'CountryId': response.UserDetails.CountryId,
                                      'StateId': response.UserDetails.StateId
                                  };

                                  $scope.EducationDetailsList = response.UserDetails.studentEducation;
                                  var keys_EducationDetailsList = Object.keys(response.UserDetails.studentEducation);
                                  if (keys_EducationDetailsList.length != 0) {
                                      $scope.bindEducationDetailsTable('5', '4', $scope.EducationDetailsList);
                                      $scope.EducationDetailsDiv = true;
                                  }

                                  $scope.ProfessionalDetailsList = response.UserDetails.studentProfessionalDetails;
                                  var keys_ProfessionalDetailsList = Object.keys(response.UserDetails.studentProfessionalDetails);
                                  if (keys_ProfessionalDetailsList.length != 0) {
                                      $scope.bindProfessionalDetailsTable('5', '4', $scope.ProfessionalDetailsList);
                                      $scope.ProfessionalDetailsDiv = true;
                                  }

                                  $scope.BankDetailsList = response.UserDetails.studentBankDetails;
                                  var keys_BankDetailsList = Object.keys(response.UserDetails.studentBankDetails);
                                  if (keys_BankDetailsList.length != 0) {
                                      $scope.bindBankDetailsTable('5', '4', $scope.BankDetailsList);
                                      $scope.BankDetailsDiv = true;
                                  }

                                  $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                  var keys_DocumentDetailsList = Object.keys(response.UserDetails.studentDocument);
                                  if (keys_DocumentDetailsList.length != 0) {
                                      $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                      $scope.DocumentDetailsDiv = true;
                                  }
                                  //$scope.DocumentDetailsList.push({ DocumentLink: DocumentUploadPath });

                                  if (response.UserDetails.CountryId !== undefined) {  // To bind State

                                      var CountryDetails = {
                                          "token": $sessionStorage.APIToken,
                                          "CountryId": response.UserDetails.CountryId
                                      }

                                      var StateDetailsData = userdetailsFactory.get_StateDetails(CountryDetails)
                                                 .success(function (response, status) {  //if request successfull  
                                                     if (status === 200) {

                                                         if (response.Message.isError === '1') {
                                                             swal("", response.Message.errorMessage, "error");
                                                         }
                                                         else {
                                                             $scope.StateList = response.StateDetails;
                                                         }
                                                     }
                                                 })
                                                 .error(function (response, status) {  //if request fail
                                                 });
                                  }
                              }
                          }
                      })
                      .error(function (response, status) {  //if fail
                      });

        $scope.SetOtherCity = function () {
            $scope.live_sel = undefined;
            $("#txtOtherCity").focus();
        };

        $scope.SetDefaultCity = function () {
            $scope.txtCity = undefined;
        };

        $scope.SetOtherNationality = function () {
            $scope.nationality_sel = undefined;
            $("#txtOtherNationality").focus();
        };

        $scope.SetDefaultNationality = function () {
            $scope.txtnationality = undefined;
        };

        $scope.Gender_Click = function () {

            if ($scope.gender_sel != undefined) {

                if ($sessionStorage.StudentId === undefined) {
                    var genderDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "UserId": $sessionStorage.UserId,
                            "Gender": $scope.gender_sel
                        }
                    };
                }
                else {
                    var genderDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "UserId": $sessionStorage.StudentId,
                            "Gender": $scope.gender_sel
                        }
                    };
                }

                var result = userdetailsFactory.post_UserDetails(genderDetails)
                      .success(function (response, status) {            //if gender details successfully posted to server

                          if (status === 200) {

                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.StudentId = response.InsertedStudent;
                                  $sessionStorage.Gender = $scope.gender_sel;
                                  $location.path('/live');  //To redirect page after successful call
                              }
                          }
                      })
                      .error(function (response, status) {  //if fail
                          if (status === 403) {
                              $sessionStorage.$reset();  //Clear the session values 
                              $window.location.reload();     //To refresh page after getting session values
                              $location.path('/login');    //To redirect page after successful login
                              swal("", "Successfully Logout", "success");
                          }
                      });
            }
            else {
                $location.path('/live');
            };
        };

        $scope.Live_Click = function () {

            if ($scope.txtCity != undefined) {
                if ($scope.txtCity.length <= 0)
                    $scope.txtCity = undefined;
            }

            if ($scope.live_sel === undefined && $scope.txtCity === undefined) {
                $location.path('/nationality');
            }
            else {
                if ($scope.live_sel != undefined) {

                    var liveDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "_id": $sessionStorage.StudentId,
                            "City": $scope.live_sel
                        }
                    };

                    var result = userdetailsFactory.post_UserDetails(liveDetails)
                          .success(function (response, status) {            //if city details successfully posted to server

                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $sessionStorage.City = $scope.live_sel;
                                      $location.path('/nationality');  //To redirect page after successful call
                                  }
                              }
                          })
                          .error(function (response) {  //if fail
                          });
                }
                else {
                    var liveDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "_id": $sessionStorage.StudentId,
                            "City": $scope.txtCity
                        }
                    };

                    var result = userdetailsFactory.post_UserDetails(liveDetails)
                          .success(function (response, status) {            //if city details successfully posted to server

                              if (status === 200) {
                                  $sessionStorage.City = $scope.txtCity;
                                  $location.path('/nationality');  //To redirect page after successful call
                              }
                          })
                          .error(function (response) {  //if fail
                          });
                }
            }
        };

        $scope.Nationality_Click = function () {

            if ($scope.txtnationality != undefined) {
                if ($scope.txtnationality.length <= 0)
                    $scope.txtnationality = undefined;
            }

            if ($scope.nationality_sel === undefined && $scope.txtnationality === undefined) {
                $location.path('/dob');
            }
            else {

                if ($scope.nationality_sel != undefined) {

                    var nationalityDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "_id": $sessionStorage.StudentId,
                            "Nationality": $scope.nationality_sel
                        }
                    };

                    var result = userdetailsFactory.post_UserDetails(nationalityDetails)
                          .success(function (response, status) {            //if nationality details successfully posted to server
                              if (status === 200) {
                                  if (response.Message.isError === '1') {
                                      swal("", response.Message.errorMessage, "error");
                                  }
                                  else {
                                      $sessionStorage.Nationality = $scope.nationality_sel;
                                      $location.path('/dob');  //To redirect page after successful call
                                  }
                              }
                          })
                          .error(function (response) {  //if fail
                          });
                }
                else {
                    var nationalityDetails = {
                        "token": $sessionStorage.APIToken,
                        "studentDetails": {
                            "_id": $sessionStorage.StudentId,
                            "Nationality": $scope.txtnationality
                        }
                    };

                    var result = userdetailsFactory.post_UserDetails(nationalityDetails)
                          .success(function (response, status) {            //if nationality details successfully posted to server
                              if (status === 200) {
                                  $sessionStorage.Nationality = $scope.txtnationality;
                                  $location.path('/dob');  //To redirect page after successful call
                              }
                              else {
                              }
                          })
                          .error(function (response) {  //if fail
                          });
                };
            }
        };

        $scope.Dob_Click = function () {

            if ($scope.txtdob != undefined) {

                var dobDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "DOB": $scope.txtdob
                    }
                };

                var result = userdetailsFactory.post_UserDetails(dobDetails)
                      .success(function (response, status) {            //if dob details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.Dob = $scope.txtdob;
                                  $location.path('/address');  //To redirect page after successful call
                              }
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
            else {
                $location.path('/address');
            };
        };

        $scope.Address_Click = function () {

            if ($scope.txtAddress != undefined) {

                var addressDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "AddressLine1": $scope.txtAddress
                    }
                };

                var result = userdetailsFactory.post_UserDetails(addressDetails)
                      .success(function (response, status) {            //if address details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.Address = $scope.txtAddress;
                                  $location.path('/passport');  //To redirect page after successful call
                              }
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
            else {
                $location.path('/passport');
            };
        };

        $scope.Passport_Click = function () {
            if ($scope.passport_sel != undefined) {

                var passportDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "PassportFlag": $scope.passport_sel
                    }
                };

                var result = userdetailsFactory.post_UserDetails(passportDetails)
                 .success(function (response, status) {            //if passport details successfully posted to server
                     if (status === 200) {
                         if (response.Message.isError === '1') {
                             swal("", response.Message.errorMessage, "error");
                         }
                         else {
                             $sessionStorage.PassportFlag = $scope.passport_sel;
                             if ($scope.passport_sel === 'true') {
                                 $location.path('/passportno');  //To redirect page after successful call
                             }
                             else {
                                 $location.path('/forexcard');  //To redirect page if no
                             }
                         }
                     }
                 })
                 .error(function (response) {  //if fail
                 });
            }
            else {
                $location.path('/forexcard');
            };
        };

        $scope.PassportNo_Click = function () {
            if ($scope.PassportNumber != undefined) {

                var passportNumberDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "PassportNumber": $scope.PassportNumber
                    }
                };

                var result = userdetailsFactory.post_UserDetails(passportNumberDetails)
                      .success(function (response, status) {            //if passport number details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.PassportNumber = $scope.PassportNumber;
                                  $location.path('/forexcard');  //To redirect page after successful call
                              }
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
            else {
                $location.path('/forexcard');
            };
        };

        $scope.ForexCard_Click = function () {
            if ($scope.forexcard_sel != undefined) {

                var forexcardDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "ForexCardFlag": $scope.forexcard_sel
                    }
                };

                var result = userdetailsFactory.post_UserDetails(forexcardDetails)
                 .success(function (response, status) {            //if forex details successfully posted to server
                     if (status === 200) {
                         if (response.Message.isError === '1') {
                             swal("", response.Message.errorMessage, "error");
                         }
                         else {
                             $sessionStorage.ForexCardFlag = $scope.forexcard_sel;

                             if ($scope.forexcard_sel === 'true') {
                                 $location.path('/forexcardno');  //To redirect page if yes
                             }
                             else {
                                 $location.path('/pancard');  //To redirect page if no
                             }
                         }
                     }
                 })
                 .error(function (response) {  //if fail
                 });
            }
            else {
                $location.path('/pancard');
            };
        };

        $scope.ForexCardNo_Click = function () {
            if ($scope.ForexCardNumber != undefined) {

                var forexCardNumberDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "ForexCardNumber": $scope.ForexCardNumber
                    }
                };

                var result = userdetailsFactory.post_UserDetails(forexCardNumberDetails)
                      .success(function (response, status) {            //if forex card number details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.ForexCardNumber = $scope.ForexCardNumber;
                                  $location.path('/pancard');  //To redirect page after successful call
                              }
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
            else {

            };
        };

        $scope.PanCard_Click = function () {
            if ($scope.pancard_sel != undefined) {

                var pancardDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "PanCardFlag": $scope.pancard_sel
                    }
                };

                var result = userdetailsFactory.post_UserDetails(pancardDetails)
                 .success(function (response, status) {            //if pancard details successfully posted to server
                     if (status === 200) {
                         if (response.Message.isError === '1') {
                             swal("", response.Message.errorMessage, "error");
                         }
                         else {
                             $sessionStorage.PanCardFlag = $scope.pancard_sel;
                             if ($scope.pancard_sel === 'true') {
                                 $location.path('/pancardno');  //To redirect page if yes
                             }
                             else {
                                 $location.path('/forex');  //To redirect page if no
                             }
                         }
                     }
                 })
                 .error(function (response) {  //if fail
                 });
            }
            else {
                $location.path('/forex');
                swal("", "User details saved successfully", "success");
            };
        };

        $scope.PanCardNo_Click = function () {

            if ($scope.PanCardNumber != undefined) {

                var panCardNumberDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "PanCardNumber": $scope.PanCardNumber
                    }
                };

                var result = userdetailsFactory.post_UserDetails(panCardNumberDetails)
                      .success(function (response, status) {            //if pan card number details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.PanCardNumber = $scope.PanCardNumber;
                                  $location.path('/forex');  //To redirect page after successful call
                                  swal("", "User details saved successfully", "success");
                              }
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
            else {
                $location.path('/forex');
                swal("", "User details saved successfully", "success");
            };
        };

        $scope.UpdatePersonalDetails_Click = function (frmUserDetails) {

            if (frmUserDetails.$valid) {

                $scope.IsPersonalDetails = true;

                var personalDetails = {
                    "token": $sessionStorage.APIToken,
                    "userDetails": {
                        "_id": $sessionStorage.UserId,
                        "FirstName": $scope.UserDetails.FirstName,
                        "LastName": $scope.UserDetails.LastName
                        //"ContactNumber": $scope.UserDetails.ContactNumber,
                        //"Email": $scope.UserDetails.Email
                    },

                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "City": $scope.UserDetails.City,
                        "Gender": $scope.UserDetails.Gender,
                        "DOB": $scope.UserDetails.DOB,
                        "Pincode": $scope.UserDetails.Pincode,
                        "StateId": $scope.UserDetails.StateId,
                        "CountryId": $scope.UserDetails.CountryId,
                        "AddressLine1": $scope.UserDetails.AddressLine1,
                        "MotherName": $scope.UserDetails.MotherName,
                        "Nationality": $scope.UserDetails.Nationality,
                        "UserId": $sessionStorage.UserId
                    }
                };

                var result = userdetailsFactory.post_UserDetails(personalDetails)
                      .success(function (response, status) {   //if Personal details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.StudentId = response.InsertedStudent;
                                  swal("Personal Details", "Your record updated successfully", "success");
                                  $scope.tab = 2;  //To redirect page after successful call
                                  $('#liTab1').removeClass('active');
                                  $('#liTab2').addClass('active');
                                  $scope.IsPersonalDetails = false;
                              }
                          }
                      })
                      .error(function (response, status) {  //if fail
                      });
            }
        };

        $scope.UpdateEducationDetails_Click = function (frmEducationalDetails) {

            if (frmEducationalDetails.$valid) {

                $scope.IsEducationalDetails = true;

                var educationDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "UserId": $sessionStorage.UserId
                    },
                    "studentEducation": [
                        {
                            "_id": $scope.EducationDetails._id,
                            "CourseName": $scope.EducationDetails.CourseName,
                            "CourseType": $scope.EducationDetails.CourseType,
                            "CourseDurationYears": $scope.EducationDetails.CourseDurationYears,
                            "Specilization": $scope.EducationDetails.Specilization,
                            "University": $scope.EducationDetails.University,
                            "MarksObtained": $scope.EducationDetails.MarksObtained,
                            "Year": $scope.EducationDetails.Year,
                            "CollegeName": $scope.EducationDetails.CollegeName,
                            "CollegeAddress": $scope.EducationDetails.CollegeAddress,
                            "CountryId": $scope.EducationDetails.CountryId
                        }
                    ]
                };
                var result = userdetailsFactory.post_UserDetails(educationDetails)
                      .success(function (response, status) {            //if details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.StudentId = response.InsertedStudent;

                                  var studentDetails = {
                                      "token": $sessionStorage.APIToken,
                                      "UserId": $sessionStorage.UserId
                                  };

                                  var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                .success(function (response, status) {            //if details successfully posted to server
                                                    if (status === 200) {
                                                        if (response.Message.isError === '1') {
                                                            swal("", response.Message.errorMessage, "error");
                                                        }
                                                        else {
                                                            $scope.EducationDetailsList = response.UserDetails.studentEducation;
                                                            var keys = Object.keys(response.UserDetails.studentEducation);
                                                            if (keys.length != 0) {
                                                                $scope.EducationDetailsDiv = true;
                                                            }
                                                            else {
                                                                $scope.EducationDetailsDiv = false;
                                                            }
                                                            $scope.bindEducationDetailsTable('5', '4', $scope.EducationDetailsList);

                                                            $scope.btnAddEducationDetails = 'Save';
                                                            $scope.EducationDetails = null;
                                                            $scope.IsEducationalDetails = false;
                                                            $scope.frmEducationalDetails.$setPristine();
                                                            $scope.frmEducationalDetails.$setUntouched();

                                                            if ($scope.btnAddEducationDetails === 'Save')
                                                                swal("Educational Details", "Your record saved successfully", "success");
                                                            else
                                                                swal("Educational Details", "Your record updated successfully", "success");
                                                            $("#txtCourseName").focus();
                                                        }
                                                    }
                                                })
                                                .error(function (response, status) {  //if fail
                                                });
                              }
                          }
                          else {
                          }
                      })
                      .error(function (response, status) {  //if fail
                      });
            }
        };

        $scope.UpdateProfessionalDetails_Click = function (frmProfessionalDetails) {

            if (frmProfessionalDetails.$valid) {

                $scope.IsProfessionalDetails = true;

                var professionalDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "UserId": $sessionStorage.UserId
                    },
                    "studentProfessionalDetails": [
                        {
                            "_id": $scope.ProfessionalDetails._id,
                            "CompanyName": $scope.ProfessionalDetails.CompanyName,
                            "FromDate": $scope.ProfessionalDetails.FromDate,
                            "ToDate": $scope.ProfessionalDetails.ToDate,
                            "AnnualPackage": $scope.ProfessionalDetails.AnnualPackage,
                            "Designation": $scope.ProfessionalDetails.Designation,
                            "IsCurrentEmployer": $scope.ProfessionalDetails.IsCurrentEmployer,
                            "CompanyAddress": $scope.ProfessionalDetails.CompanyAddress,
                            "TotalExperience": $scope.ProfessionalDetails.TotalExperience
                        }
                    ]
                };

                var result = userdetailsFactory.post_UserDetails(professionalDetails)
                      .success(function (response, status) {            //if professional card number details successfully posted to server
                          if (status === 200) {

                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.StudentId = response.InsertedStudent;

                                  var studentDetails = {
                                      "token": $sessionStorage.APIToken,
                                      "UserId": $sessionStorage.UserId
                                  };

                                  var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                .success(function (response, status) {            //if details successfully posted to server
                                                    if (status === 200) {
                                                        if (response.Message.isError === '1') {
                                                            swal("", response.Message.errorMessage, "error");
                                                        }
                                                        else {

                                                            $scope.ProfessionalDetailsList = response.UserDetails.studentProfessionalDetails;
                                                            var keys = Object.keys(response.UserDetails.studentProfessionalDetails);
                                                            if (keys.length != 0) {
                                                                $scope.ProfessionalDetailsDiv = true;
                                                            }
                                                            else {
                                                                $scope.ProfessionalDetailsDiv = false;
                                                            }
                                                            $scope.bindProfessionalDetailsTable('5', '4', $scope.ProfessionalDetailsList);

                                                            if ($scope.btnAddProfessionalDetails === 'Save')
                                                                swal("Professional Details", "Your record saved successfully", "success");
                                                            else
                                                                swal("Professional Details", "Your record updated successfully", "success");

                                                            $scope.btnAddProfessionalDetails = 'Save';
                                                            $scope.ProfessionalDetails = null;
                                                            $scope.IsProfessionalDetails = false;
                                                            $scope.frmProfessionalDetails.$setPristine();
                                                            $scope.frmProfessionalDetails.$setUntouched();
                                                            $("#txtCompanyName").focus();
                                                        }
                                                    }
                                                })
                                                .error(function (response, status) {  //if fail
                                                });
                              }
                          }
                          else {
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
        };

        $scope.UpdateBankDetails_Click = function (frmBankDetails) {

            if (frmBankDetails.$valid) {

                $scope.IsBankDetails = true;

                var bankDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "_id": $sessionStorage.StudentId,
                        "UserId": $sessionStorage.UserId
                    },
                    "studentBankDetails": [
                        {
                            "_id": $scope.BankDetails._id,
                            "BankName": $scope.BankDetails.BankName,
                            "AccountNumber": $scope.BankDetails.AccountNumber,
                            "CountryId": $scope.BankDetails.CountryId,
                            "BankAddress": $scope.BankDetails.BankAddress
                        }
                    ]
                };

                var result = userdetailsFactory.post_UserDetails(bankDetails)
                      .success(function (response, status) {            //if professional card number details successfully posted to server
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $sessionStorage.StudentId = response.InsertedStudent;

                                  var studentDetails = {
                                      "token": $sessionStorage.APIToken,
                                      "UserId": $sessionStorage.UserId
                                  };

                                  var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                .success(function (response, status) {            //if details successfully posted to server
                                                    if (status === 200) {
                                                        if (response.Message.isError === '1') {
                                                            swal("", response.Message.errorMessage, "error");
                                                        }
                                                        else {
                                                            $scope.BankDetailsList = response.UserDetails.studentBankDetails;
                                                            var keys = Object.keys(response.UserDetails.studentBankDetails);
                                                            if (keys.length != 0) {
                                                                $scope.BankDetailsDiv = true;
                                                            }
                                                            else {
                                                                $scope.BankDetailsDiv = false;
                                                            }
                                                            $scope.bindBankDetailsTable('5', '4', $scope.BankDetailsList);

                                                            if ($scope.btnAddBankDetails === 'Save')
                                                                swal("Bank Details", "Your record saved successfully", "success");
                                                            else
                                                                swal("Bank Details", "Your record updated successfully", "success");

                                                            $scope.btnAddBankDetails = 'Save';
                                                            $scope.BankDetails = null;
                                                            $scope.IsBankDetails = false;
                                                            $scope.frmBankDetails.$setPristine();
                                                            $scope.frmBankDetails.$setUntouched();
                                                            $("#txtBankName").focus();
                                                        }
                                                    }
                                                })
                                                .error(function (response, status) {  //if fail
                                                });
                              }
                          }
                          else {
                          }
                      })
                      .error(function (response) {  //if fail
                      });
            }
        };

        $scope.UpdateDocumentDetails_Click = function (frmDocUpload) {  //uploadFile

            if (frmDocUpload.$valid) {
                if ($scope.myFile !== undefined) {
                    if ($scope.myFile !== null) {
                        $scope.loading = true;
                        $scope.IsDocumentUploadDetails = true;

                        var file = $scope.myFile;
                        var tokenDetails = {
                            "token": $sessionStorage.APIToken
                        };

                        var result = userdetailsFactory.uploadFileToUrl(file, tokenDetails)
                        .success(function (response, status) {            //if details successfully posted to server
                            if (status === 200) {
                                if (response.Message.isError === '1') {
                                    swal("", response.Message.errorMessage, "error");
                                    $scope.IsDocumentUploadDetails = false;
                                    $scope.loading = false;
                                }
                                else {

                                    var documentDetails = {
                                        "token": $sessionStorage.APIToken,
                                        "studentDetails": {
                                            "_id": $sessionStorage.StudentId,
                                            "UserId": $sessionStorage.UserId
                                        },

                                        "studentDocument": [{
                                            "DocumentName": file.name,
                                            "DocumentTypeId": $scope.DocumentDetails.DocumentTypeId,
                                            "DocumentPath": response.DocumentPath
                                        }
                                        ]
                                    };
                                    var doumentDetailsResult = userdetailsFactory.post_UserDetails(documentDetails)
                                        .success(function (response, status) {            //if details successfully posted to server

                                            if (status === 200) {
                                                if (response.Message.isError === '1') {
                                                    swal("", response.Message.errorMessage, "error");
                                                    $scope.loading = false;
                                                }
                                                else {

                                                    $sessionStorage.StudentId = response.InsertedStudent;

                                                    var studentDetails = {
                                                        "token": $sessionStorage.APIToken,
                                                        "UserId": $sessionStorage.UserId
                                                    };

                                                    var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                                 .success(function (response, status) {            //if details successfully posted to server

                                                                     if (status === 200) {
                                                                         if (response.Message.isError === '1') {
                                                                             swal("", response.Message.errorMessage, "error");
                                                                         }
                                                                         else {
                                                                             $("#fuDocumentUpload").val('');
                                                                             $scope.myFile = null;
                                                                             $scope.DocumentDetails = null;
                                                                             $scope.frmDocUpload.$setPristine();
                                                                             $scope.frmDocUpload.$setUntouched();
                                                                             $scope.IsDocumentUploadDetails = false;
                                                                             $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                                                             var keys = Object.keys(response.UserDetails.studentDocument);
                                                                             if (keys.length != 0) {
                                                                                 $scope.DocumentDetailsDiv = true;
                                                                             }
                                                                             else {
                                                                                 $scope.DocumentDetailsDiv = false;
                                                                             }
                                                                             $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                                                         }
                                                                     }
                                                                 })
                                                                 .error(function (response, status) {  //if fail
                                                                 });
                                                    $scope.loading = false;
                                                    swal("Upload!", "Your data has been uploaded", "success");
                                                }
                                            }
                                        })
                                }
                            }

                        })
                        .error(function (response, status) {  //if fail
                            console.log('Errorrr:' + JSON.stringify(response));
                            console.log('Main Errorrr' + status);
                            swal("", response, "error");
                        });
                    }
                    else {
                        swal("", "Please select file to upload", "error");
                    }
                }
                else {
                    swal("", "Please select file to upload", "error");
                }
            }
        };

        $scope.DeleteEducationDetails = function (id) {

            if (id !== undefined) {

                swal({
                    title: "Are you sure you want to delete?",
                    text: "You will not be able to recover this data!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {

                        var educationDetails = {
                            "token": $sessionStorage.APIToken,
                            "studentDetails": {
                                "_id": $sessionStorage.StudentId
                            },

                            "studentEducation": [
                             {
                                 "_id": id
                             }
                            ]
                        };

                        var result = userdetailsFactory.delete_UserDetails(educationDetails)
                             .success(function (response, status) {            //if successfully deleted 
                                 if (status === 200) {

                                     if (response.Message.isError === '1') {
                                         swal("", response.Message.errorMessage, "error");
                                     }
                                     else {
                                         var studentDetails = {
                                             "token": $sessionStorage.APIToken,
                                             "UserId": $sessionStorage.UserId
                                         };

                                         var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                       .success(function (response, status) {            //if details successfully posted to server
                                                           if (status === 200) {

                                                               $scope.btnAddEducationDetails = 'Save';
                                                               $scope.EducationDetails = null;
                                                               $scope.EducationDetailsList = response.UserDetails.studentEducation;
                                                               var keys = Object.keys(response.UserDetails.studentEducation);
                                                               if (keys.length != 0) {
                                                                   $scope.EducationDetailsDiv = true;
                                                               }
                                                               else {
                                                                   $scope.EducationDetailsDiv = false;
                                                               }
                                                               $scope.bindEducationDetailsTable('5', '4', $scope.EducationDetailsList);
                                                           }
                                                       })
                                                       .error(function (response, status) {  //if fail
                                                       });
                                     }
                                 }
                             })
                             .error(function (response, status) {  //if fail
                             });

                        swal("Deleted!", "Your data has been deleted.", "success");
                    }
                });
            }
        };

        $scope.DeleteProfessionalDetails = function (id) {

            if (id !== undefined) {

                swal({
                    title: "Are you sure you want to delete?",
                    text: "You will not be able to recover this data!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {

                        var professionalDetails = {
                            "token": $sessionStorage.APIToken,
                            "studentDetails": {
                                "_id": $sessionStorage.StudentId
                            },

                            "studentProfessionalDetails": [
                             {
                                 "_id": id
                             }
                            ]
                        };

                        var result = userdetailsFactory.delete_UserDetails(professionalDetails)
                              .success(function (response, status) {            //if successfully deleted 
                                  if (status === 200) {
                                      if (response.Message.isError === '1') {
                                          swal("", response.Message.errorMessage, "error");
                                      }
                                      else {

                                          var studentDetails = {
                                              "token": $sessionStorage.APIToken,
                                              "UserId": $sessionStorage.UserId
                                          };

                                          var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                        .success(function (response, status) {            //if details successfully posted to server
                                                            if (status === 200) {
                                                                $scope.btnAddProfessionalDetails = 'Save';
                                                                $scope.ProfessionalDetails = null;
                                                                $scope.ProfessionalDetailsList = response.UserDetails.studentProfessionalDetails;
                                                                var keys = Object.keys(response.UserDetails.studentProfessionalDetails);
                                                                if (keys.length != 0) {
                                                                    $scope.ProfessionalDetailsDiv = true;
                                                                }
                                                                else {
                                                                    $scope.ProfessionalDetailsDiv = false;
                                                                }
                                                                $scope.bindProfessionalDetailsTable('5', '4', $scope.ProfessionalDetailsList);
                                                            }
                                                        })
                                                        .error(function (response, status) {  //if fail
                                                        });
                                      }
                                  }
                              })
                              .error(function (response, status) {  //if fail
                              });
                        swal("Deleted!", "Your data has been deleted.", "success");
                    }
                });
            }
        };

        $scope.DeleteBankDetails = function (id) {

            if (id !== undefined) {

                swal({
                    title: "Are you sure you want to delete?",
                    text: "You will not be able to recover this data!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {

                        var bankDetails = {
                            "token": $sessionStorage.APIToken,
                            "studentDetails": {
                                "_id": $sessionStorage.StudentId
                            },

                            "studentBankDetails": [
                             {
                                 "_id": id
                             }
                            ]
                        };

                        var result = userdetailsFactory.delete_UserDetails(bankDetails)
                              .success(function (response, status) {            //if successfully deleted 

                                  if (status === 200) {
                                      if (response.Message.isError === '1') {
                                          swal("", response.Message.errorMessage, "error");
                                      }
                                      else {
                                          var studentDetails = {
                                              "token": $sessionStorage.APIToken,
                                              "UserId": $sessionStorage.UserId
                                          };

                                          var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                       .success(function (response, status) {            //if details successfully posted to server
                                                           if (status === 200) {
                                                               if (response.Message.isError === '1') {
                                                                   swal("", response.Message.errorMessage, "error");
                                                               }
                                                               else {
                                                                   $scope.btnAddBankDetails = 'Save';
                                                                   $scope.BankDetails = null;
                                                                   $scope.BankDetailsList = response.UserDetails.studentBankDetails;
                                                                   var keys = Object.keys(response.UserDetails.studentBankDetails);
                                                                   if (keys.length != 0) {
                                                                       $scope.BankDetailsDiv = true;
                                                                   }
                                                                   else {
                                                                       $scope.BankDetailsDiv = false;
                                                                   }
                                                                   $scope.bindBankDetailsTable('5', '4', $scope.BankDetailsList);
                                                               }
                                                           }
                                                       })
                                                       .error(function (response, status) {  //if fail
                                                       });
                                      }
                                  }
                              })
                              .error(function (response, status) {  //if fail
                              });
                        swal("Deleted!", "Your data has been deleted.", "success");
                    }
                });
            }
        };

        $scope.DeleteDocumentDetails = function (id, docPath) {

            if (id !== undefined) {

                swal({
                    title: "Are you sure you want to delete?",
                    text: "You will not be able to recover this data!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {

                        var documentDetails = {
                            "token": $sessionStorage.APIToken,
                            "studentDetails": {
                                "_id": $sessionStorage.StudentId
                            },

                            "studentDocument": [
                             {
                                 "_id": id,
                                 "DocumentPath": docPath
                             }
                            ]
                        };
                        var result = userdetailsFactory.delete_UserDetails(documentDetails)
                              .success(function (response, status) {            //if successfully deleted 

                                  if (status === 200) {
                                      if (response.Message.isError === '1') {
                                          swal("", response.Message.errorMessage, "error");
                                      }
                                      else {
                                          var studentDetails = {
                                              "token": $sessionStorage.APIToken,
                                              "UserId": $sessionStorage.UserId
                                          };

                                          var userdetails = userdetailsFactory.get_UserDetails(studentDetails)
                                                       .success(function (response, status) {            //if details successfully posted to server

                                                           if (status === 200) {
                                                               if (response.Message.isError === '1') {
                                                                   swal("", response.Message.errorMessage, "error");
                                                               }
                                                               else {
                                                                   $scope.DocumentDetailsList = response.UserDetails.studentDocument;
                                                                   var keys = Object.keys(response.UserDetails.studentDocument);
                                                                   if (keys.length != 0) {
                                                                       $scope.DocumentDetailsDiv = true;
                                                                   }
                                                                   else {
                                                                       $scope.DocumentDetailsDiv = false;
                                                                   }
                                                                   $scope.bindDocumentDetailsTable('5', '4', $scope.DocumentDetailsList);
                                                               }
                                                           }
                                                       })
                                                       .error(function (response, status) {  //if fail
                                                       });
                                      }
                                  }
                              })
                              .error(function (response, status) {  //if fail
                              });
                        swal("Deleted!", "Your data has been deleted.", "success");
                    }
                });
            }
        };

        $scope.EditEducationDetails = function (id) {
            if (id !== undefined) {
                var educationDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "UserId": $sessionStorage.UserId
                    },

                    "studentEducation": {
                        "_id": id
                    }
                };

                var result = userdetailsFactory.edit_UserDetails(educationDetails)
                      .success(function (response, status) {            //if successfully deleted 
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $scope.EducationDetails = response.UserDetails.studentEducation[0];
                                  $scope.btnAddEducationDetails = 'Update';
                              }
                          }
                      })
                      .error(function (response, status) {  //if fail
                      });
            }
        };

        $scope.EditProfessionalDetails = function (id) {

            if (id !== undefined) {
                var professionalDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "UserId": $sessionStorage.UserId
                    },

                    "studentProfessionalDetails": {
                        "_id": id
                    }

                };

                var result = userdetailsFactory.edit_UserDetails(professionalDetails)
                      .success(function (response, status) {            //if successfully deleted 
                          if (status === 200) {
                              if (response.Message.isError === '1') {
                                  swal("", response.Message.errorMessage, "error");
                              }
                              else {
                                  $scope.ProfessionalDetails = response.UserDetails.studentProfessionalDetails[0];
                                  $scope.btnAddProfessionalDetails = 'Update';
                              }
                          }
                      })
                      .error(function (response, status) {  //if fail
                      });
            }
        };

        $scope.EditBankDetails = function (id) {

            if (id !== undefined) {
                var bankDetails = {
                    "token": $sessionStorage.APIToken,
                    "studentDetails": {
                        "UserId": $sessionStorage.UserId
                    },

                    "studentBankDetails": {
                        "_id": id
                    }
                };

                var result = userdetailsFactory.edit_UserDetails(bankDetails)
                       .success(function (response, status) {            //if successfully deleted 
                           if (status === 200) {
                               if (response.Message.isError === '1') {
                                   swal("", response.Message.errorMessage, "error");
                               }
                               else {
                                   $scope.BankDetails = response.UserDetails.studentBankDetails[0];
                                   $scope.btnAddBankDetails = 'Update';
                               }
                           }
                       })
                       .error(function (response, status) {  //if fail
                       });
            }
        };

        $scope.ChangePassword_Click = function (frmAccountSettings) {
            if ($sessionStorage.UserId != undefined && $scope.CurrentPassword != undefined && $scope.NewPassword != undefined && $scope.ConfirmPassword != undefined) {

                if ($scope.NewPassword === $scope.ConfirmPassword) {

                    if ($scope.CurrentPassword === $scope.ConfirmPassword) {
                        swal("", "Current password & new password should be different", "error");
                    }
                    else {
                        var changePasswordDetails = {   // getting details
                            '_id': $sessionStorage.UserId,
                            'Password': $scope.CurrentPassword,
                            'NewPassword': $scope.ConfirmPassword
                        };

                        var lg = loginFactory.changePassword(changePasswordDetails)
                              .success(function (response, status) {            //if success

                                  if (status === 200) {
                                      if (response.Message.isError === '1') {
                                          swal("", response.Message.errorMessage, "error");
                                      }
                                      else {
                                          $scope.CurrentPassword = null;
                                          $scope.NewPassword = null;
                                          $scope.ConfirmPassword = null;
                                          $scope.frmAccountSettings.$setPristine();
                                          $scope.frmAccountSettings.$setUntouched();
                                          swal("", "Password changed successfully", "success");
                                      }
                                  }
                              })
                              .error(function (response) {  //if fail
                                  swal("", "Something went wrong", "error");
                              });
                    }
                }
                else {
                    swal("", "New password & confirm password should be same", "error");
                }

            }
        }

        $scope.Finish_Click = function () {

            $location.path('/');  //To redirect page if yes
            swal("", "Profile details updated successfully", "success");
        }

        $scope.bindEducationDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.CourseDetailsTable = new NgTableParams(
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

        $scope.bindProfessionalDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.ProfessionalDetailsTable = new NgTableParams(
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

        $scope.bindBankDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.BankDetailsTable = new NgTableParams(
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

        $scope.bindDocumentDetailsTable = function (itemCount, pgMaxBlocks, datalist) {

            $scope.DocumentDetailsTable = new NgTableParams(
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

        $scope.sortUserDetails = function (columnName) {
            $scope.SortUserDtlsBy = columnName;
            $scope.reverseUserDtls = !$scope.reverseUserDtls;
        };

        //Code for auto complete to city textbox
        //$scope.place = null;
        //$scope.autocompleteOptions = {
        //    types: ['(cities)'],
        //    componentRestrictions: { country: 'india' }
        //}

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
},{}],19:[function(require,module,exports){
/**
 * Created by Rahul S on 15-06-2016.
 */
var module_name = 'app.userdetails';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule(module_name,[]);
},{}],20:[function(require,module,exports){


(function() {
    'use strict';

    angular
        .module('app')
        .controller('shared.controller', shared_controller);

    shared_controller.$inject = ['$scope', '$sessionStorage', '$location', '$window'];

    function shared_controller($scope, $sessionStorage, $location, $window) {
        
        $scope.loggedInUserName = $sessionStorage.UserName;
        $scope.loggedInUserFullName = $sessionStorage.UserFullName;
        $scope.isUserLoggedIn = $sessionStorage.IsUserLoggedIn;
        $scope.showJoinUs = $sessionStorage.ShowJoinUs;

        $scope.Logout_Click = function () {
            
            if ($scope.isUserLoggedIn != null && $scope.isUserLoggedIn != "false") {  //Check wheather user is loggedin or not
                $sessionStorage.$reset();  //Clear the session values 
                $location.path('/');    //To redirect page after successful login
                $window.location.reload();     //To refresh page after getting session values
                swal("", "Successfully Logout", "success");
            }
            else {
                swal("", "Please login fisrt", "error");
            }
        };
        
        $scope.TravelInsurance_Click = function () {
            $('ul li ').removeClass('active');
            $('#liTravelInsurance').addClass('active');
        }

        $scope.HealthInsurance_Click = function () {
            $('ul li ').removeClass('active');
            $('#liHealthInsurance').addClass('active');
        }

        $scope.AirTickets_Click = function () {
            $('ul li ').removeClass('active');
            $('#liAirTickets').addClass('active');
        }

        $scope.CreditCard_Click = function () {
            $('ul li ').removeClass('active');
            $('#liCreditCard').addClass('active');
        }

        $scope.AboutUs_Click = function () {
            $('ul li ').removeClass('active');
            $('#liAboutUs').addClass('active');
        }

        $scope.ContactUs_Click = function () {
            $('ul li ').removeClass('active');
            $('#liContactUs').addClass('active');
        }
    }
})();

},{}],21:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app').directive("regExInput", function () {
        "use strict";
        return {
            restrict: "A",
            require: "?regEx",
            scope: {},
            replace: false,
            link: function (scope, element, attrs, ctrl) {
                element.bind('keypress', function (event) {
                    var regex = new RegExp(attrs.regEx);
                    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                    if (!regex.test(key)) {
                        event.preventDefault();
                        return false;
                    }
                });
            }
        };
    });
    
    angular.module('app').directive('loading', function () {
      return {
          restrict: 'E',
          replace: true,
          template: ' <div id="loader-wrapper" class="main-progress"><div id="loader" class="sub-progress"></div><div class="loader-section section-left"></div><div class="loader-section section-right"></div></div>',
          link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
          }
      }
    })

    //angular.module('app').directive('loading', function () {
    //    return {
    //        restrict: 'E',
    //        replace: true,
    //        template: ' <div class="main-progress"><div class="sub-progress"><div class="loading"><img src="/assets/images/Loader.gif" />LOADING...</div></div></div>',
    //        link: function (scope, element, attr) {
    //            scope.$watch('loading', function (val) {
    //                if (val)
    //                    $(element).show();
    //                else
    //                    $(element).hide();
    //            });
    //        }
    //    }
    //})


    angular.module('app').directive("compareTo", function() {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function(scope, element, attributes, ngModel) {
             
                    ngModel.$validators.compareTo = function(modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
 
                    scope.$watch("otherModelValue", function() {
                        ngModel.$validate();
                    });
                }
            };
        });

    angular.module('app').directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    angular.module('app').directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
                '<div class="modal-dialog">' +
                  '<div class="Bmodal-content">' +
                //'<div class="modal-header">' +
                '<div style="padding:20px">' +
                    '<div class="row ModalTitleRow" >' +
                         '<div class="col-md-1"></div>' +
                         '<div class="col-md-10 ModalTitle" >Grievances Details</div>' +
                         '<div class="col-md-1">' +
                          '<button type="button" class="Bclose ModalCancelBtn" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="modal-body">' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont" ><label>Ticket Number </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.TicketNo}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Raise Date </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.RaiseDate}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title"><label>Product </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.Product}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Grievance Type </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.GrievanceType}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Reference Number </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.ReferenceNumber}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Status </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.Status}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Query Details </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.QueryDetails}}</div>' +
                    '</div>' +

                   // '<div class="modal-body" ng-transclude></div>' +
                //    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.$watch(attrs.visible, function (value) {
                    if (value == true) {
                        $(element).modal('show');
                    }
                    else {
                        $(element).modal('hide');
                    }
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {

                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

})();
},{}],22:[function(require,module,exports){
(function(){
    var cookiesService = function($cookies){
        this.getCookie = function(key){
            return $cookies.get(key);
        };
        
        this.putCookie = function(key, value){
            $cookies.put(key, value);
        };
        
        this.removeCookie = function(key){
            $cookies.remove(key);
        };
    };
    
    cookiesService.$inject = ['$cookies'];
    
    angular.module('app').service('cookiesService', cookiesService);
}());
},{}],23:[function(require,module,exports){
/**
 * Created by RahulS on 08-07-2016.
 */

(function () {
    var forexFactory = function ($http, APIPath) {

        var post_NewCardDetails = function (data) {
            return $http.post(APIPath + 'UpdateOrder', data).success(function (data) {
            });
        };

        var get_ForexExchangeDetails = function (data) {
            return $http.post(APIPath + 'GetQuote', data).success(function (data) {
            });
        };

        var get_NewCardDetailsByUserId = function (data) {
            return $http.post(APIPath + 'GetOrderDetailsByUserId', data).success(function (data) {
            });
        };

        return { post_NewCardDetails: post_NewCardDetails, get_ForexExchangeDetails: get_ForexExchangeDetails, get_NewCardDetailsByUserId: get_NewCardDetailsByUserId };
    };

    forexFactory.$inject = ['$http', 'APIPath'];
    angular.module('app').factory('forexFactory', forexFactory);

}());
},{}],24:[function(require,module,exports){
(function () {
    var homeFactory = function ($http, APIPath, $sessionStorage) {

        var headers = { 'token': $sessionStorage.APIToken }


        var grievance = function (data) {
            return $http.post(APIPath + 'UpdateGrievances', data).success(function (data) {
            });
        };

        var get_GrievanceDetails = function (data) {
            return $http.post(APIPath + 'GetGrievancesByUserId', data).success(function (data) {
            });
        };

        var get_GrievancesTypeList = function () {
            return $http.get(APIPath + 'GetAllGrievancesType', { headers: headers }).success(function (data) {
            });
        };

        return { grievance: grievance, get_GrievanceDetails: get_GrievanceDetails, get_GrievancesTypeList: get_GrievancesTypeList };
    };

    homeFactory.$inject = ['$http', 'APIPath', '$sessionStorage'];
    angular.module('app').factory('homeFactory', homeFactory);

}());
},{}],25:[function(require,module,exports){
/**
 * Created by RahulS on 03-06-2016.
 */

(function () {
    var loginFactory = function ($http, APIPath) {

        var login = function (data) {
            return $http.post(APIPath + 'Login', data).success(function (data) {
            });
        };

        var registration = function (data) {
            return $http.post(APIPath + 'Registration', data).success(function (data) {
            });
        };

        var forgotpassword = function (data) {
            return $http.post(APIPath + 'ForgotPassword', data).success(function (data) {
            });
        };

        var resetPassword = function (data) {
            return $http.post(APIPath + 'ResetPassword', data).success(function (data) {
            });
        };

        var changePassword = function (data) {
            return $http.post(APIPath + 'ChangePassword', data).success(function (data) {
            });
        };

        return { login: login, registration: registration, forgotpassword: forgotpassword, resetPassword: resetPassword, changePassword: changePassword };
    };



    loginFactory.$inject = ['$http', 'APIPath'];
    angular.module('app').factory('loginFactory', loginFactory);

}());
},{}],26:[function(require,module,exports){
/**
 * Created by RahulS on 08-07-2016.
 */

(function () {
    var userdetailsFactory = function ($http, APIPath, $sessionStorage) {

        var headers = { 'token': $sessionStorage.APIToken }

        var post_UserDetails = function (data) {
            return $http.post(APIPath + 'updateStudentDetails', data).success(function (data) {
            });
        };

        var get_UserDetails = function (data) {
            return $http.post(APIPath + 'getStudentDetailsById', data).success(function (data) {
            });
        };

        var delete_UserDetails = function (data) {
            return $http.post(APIPath + 'deleteStudentDetails', data).success(function (data) {
            });
        };

        var edit_UserDetails = function (data) {
            return $http.post(APIPath + 'GetSpecificDetailsOfStudent', data).success(function (data) {
            });
        };

        var get_CountryDetails = function () {
            return $http.get(APIPath + 'GetAllCountryDetails', { headers: headers }).success(function (data) {
            });
        };

        var get_StateDetails = function (data) {
            return $http.post(APIPath + 'GetAllStateDetailsByCountryId', data).success(function (data) {
            });
        };

        var get_CurrencyDetails = function () {
            return $http.get(APIPath + 'GetAllCurrencyDetails', { headers: headers }).success(function (data) {
            });
        };

        var get_DocumentsList = function () {
            return $http.get(APIPath + 'getAllDocuments', { headers: headers }).success(function (data) {
            });
        };

        var get_ProductsList = function () {
            return $http.get(APIPath + 'getAllProductType', { headers: headers }).success(function (data) {
            });
        };

        var uploadFileToUrl = function (file, data) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post(APIPath + 'upload', fd, { transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'token': $sessionStorage.APIToken, "studentid": $sessionStorage.StudentId } }).success(function () { console.log('File Uploaded.... '); }).error(function () { console.log('Fail to upload'); });
        };

        return { post_UserDetails: post_UserDetails, get_UserDetails: get_UserDetails, delete_UserDetails: delete_UserDetails, edit_UserDetails: edit_UserDetails, get_CountryDetails: get_CountryDetails, get_StateDetails: get_StateDetails, get_CurrencyDetails: get_CurrencyDetails, get_DocumentsList: get_DocumentsList, get_ProductsList: get_ProductsList, uploadFileToUrl: uploadFileToUrl };
    };

    userdetailsFactory.$inject = ['$http', 'APIPath', '$sessionStorage'];
    angular.module('app').factory('userdetailsFactory', userdetailsFactory);

}());
},{}],27:[function(require,module,exports){
/**
 * Created by RahulS on 03-06-2016.
 */


angular.module('app').value('Host', '192.168.9.118/StudentPaisa/#');

angular.module('app').value('APIPath', 'http://192.168.0.11:8081/api/');

//angular.module('app').value('APIPath', 'http://192.168.9.72:8081/api/');

//angular.module('app').value('APIPath', 'http://192.168.0.11:8082/api/');

//angular.module('app').value('APIPath', 'http://104.215.141.1:8081/api/');

angular.module('app').value('DocumentUploadPath', 'http://192.168.0.11:8081/');

},{}]},{},[1,22,23,24,25,26,27,20,21,4,7,10,13,16,19,3,6,9,12,15,18,2,5,8,11,14,17]);
