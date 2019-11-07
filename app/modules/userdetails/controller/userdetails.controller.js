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