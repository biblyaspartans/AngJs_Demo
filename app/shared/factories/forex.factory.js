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