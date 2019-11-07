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