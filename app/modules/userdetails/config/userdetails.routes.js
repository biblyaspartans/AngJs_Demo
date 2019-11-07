/**
 * Created by rahuls on 15-06-2016.
 */
(function () {
    'use strict';

    angular
        .module('app.userdetails')
        .config(appRoutes);
    appRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function appRoutes($routeProvider, $locationProvider) {

        $routeProvider

            .when('/gender', {
                templateUrl: 'app/modules/userdetails/views/userdetails_gender.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/live', {
                templateUrl: 'app/modules/userdetails/views/userdetails_live.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/nationality', {
                templateUrl: 'app/modules/userdetails/views/userdetails_nationality.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/name', {
                templateUrl: 'app/modules/userdetails/views/userdetails_name.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/dob', {
                templateUrl: 'app/modules/userdetails/views/userdetails_dob.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/contact', {
                templateUrl: 'app/modules/userdetails/views/userdetails_contact.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/address', {
                templateUrl: 'app/modules/userdetails/views/userdetails_address.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/passport', {
                templateUrl: 'app/modules/userdetails/views/userdetails_passport.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/passportno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_passportno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/forexcard', {
                templateUrl: 'app/modules/userdetails/views/userdetails_forexcard.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/forexcardno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_forexcardno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/pancard', {
                templateUrl: 'app/modules/userdetails/views/userdetails_pancard.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/pancardno', {
                templateUrl: 'app/modules/userdetails/views/userdetails_pancardno.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            })
            .when('/userprofile', {
                templateUrl: 'app/modules/userdetails/views/userprofile.html',
                controller: 'userdetails.controller',
                resolve: {
                }
            });
    }
})();
