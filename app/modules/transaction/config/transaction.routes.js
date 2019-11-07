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