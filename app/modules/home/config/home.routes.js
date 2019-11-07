/**
 * Created by rahuls on 30-05-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.home')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

        .when('/', {
            templateUrl: 'app/modules/home/views/home.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/comingsoon', {
            templateUrl: 'app/modules/home/views/comingsoon.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/resetpassword/:token', {
            templateUrl: 'app/modules/home/views/resetpassword.html',
            controller: 'home.controller',
            resolve: {
            }
        })
        .when('/changepassword', {
            templateUrl: 'app/modules/home/views/changepassword.html',
            controller: 'home.controller',
            resolve: {
            }
        });
    }
})();