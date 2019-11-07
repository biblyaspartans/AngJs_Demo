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