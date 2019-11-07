/**
 * Created by Rahul S on 3-10-2016.
 */

(function () {
    'use strict';

    angular
        .module('app.grievance')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider
             .when('/grievance', {
                 templateUrl: 'app/modules/grievance/views/grievance.html',
                 controller: 'grievance.controller',
                 resolve: {
                 }
             })
            .when('/grievancelist', {
                templateUrl: 'app/modules/grievance/views/grievancelist.html',
                controller: 'grievance.controller',
                resolve: {
                }
            });
    }
})();