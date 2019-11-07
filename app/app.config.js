/**
 * Created by Rahuls on 20/6/2016.
 */

'use strict';

// Init the application configuration module for AngularJS application
window.ApplicationConfiguration = (function () {

    var applicationModuleName = 'app';

    var applicationModuleVendorDependencies = ['ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngCookies',
        'ngStorage',
        'ngMessages',
        'jcs-autoValidate',
        'google.places',
        'angularjs-crypto',
        'angularUtils.directives.dirPagination',
        'ngIdle',
        'ui.bootstrap',
        'ngTable'
    ];

    angular.module(applicationModuleName, applicationModuleVendorDependencies || []);

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
    angular.module(applicationModuleName)
    .run([
    'defaultErrorMessageResolver',
    function (defaultErrorMessageResolver) {
        defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
            errorMessages['emailInvalid'] = 'invalid email address';
        });
    }
    ]);

    angular.module(applicationModuleName).config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
        IdleProvider.idle(5);
        IdleProvider.timeout(5);
        KeepaliveProvider.interval(10);
    }]);

    angular.module(applicationModuleName).run(['Idle', function (Idle) {
        Idle.watch();
    }]);

})();
