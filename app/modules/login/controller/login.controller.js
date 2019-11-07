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