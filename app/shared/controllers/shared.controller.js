

(function() {
    'use strict';

    angular
        .module('app')
        .controller('shared.controller', shared_controller);

    shared_controller.$inject = ['$scope', '$sessionStorage', '$location', '$window'];

    function shared_controller($scope, $sessionStorage, $location, $window) {
        
        $scope.loggedInUserName = $sessionStorage.UserName;
        $scope.loggedInUserFullName = $sessionStorage.UserFullName;
        $scope.isUserLoggedIn = $sessionStorage.IsUserLoggedIn;
        $scope.showJoinUs = $sessionStorage.ShowJoinUs;

        $scope.Logout_Click = function () {
            
            if ($scope.isUserLoggedIn != null && $scope.isUserLoggedIn != "false") {  //Check wheather user is loggedin or not
                $sessionStorage.$reset();  //Clear the session values 
                $location.path('/');    //To redirect page after successful login
                $window.location.reload();     //To refresh page after getting session values
                swal("", "Successfully Logout", "success");
            }
            else {
                swal("", "Please login fisrt", "error");
            }
        };
        
        $scope.TravelInsurance_Click = function () {
            $('ul li ').removeClass('active');
            $('#liTravelInsurance').addClass('active');
        }

        $scope.HealthInsurance_Click = function () {
            $('ul li ').removeClass('active');
            $('#liHealthInsurance').addClass('active');
        }

        $scope.AirTickets_Click = function () {
            $('ul li ').removeClass('active');
            $('#liAirTickets').addClass('active');
        }

        $scope.CreditCard_Click = function () {
            $('ul li ').removeClass('active');
            $('#liCreditCard').addClass('active');
        }

        $scope.AboutUs_Click = function () {
            $('ul li ').removeClass('active');
            $('#liAboutUs').addClass('active');
        }

        $scope.ContactUs_Click = function () {
            $('ul li ').removeClass('active');
            $('#liContactUs').addClass('active');
        }
    }
})();
