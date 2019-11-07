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