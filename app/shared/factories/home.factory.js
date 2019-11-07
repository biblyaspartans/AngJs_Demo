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