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