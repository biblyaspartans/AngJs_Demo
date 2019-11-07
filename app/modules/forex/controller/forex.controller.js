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