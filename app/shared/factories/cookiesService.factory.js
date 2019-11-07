(function(){
    var cookiesService = function($cookies){
        this.getCookie = function(key){
            return $cookies.get(key);
        };
        
        this.putCookie = function(key, value){
            $cookies.put(key, value);
        };
        
        this.removeCookie = function(key){
            $cookies.remove(key);
        };
    };
    
    cookiesService.$inject = ['$cookies'];
    
    angular.module('app').service('cookiesService', cookiesService);
}());