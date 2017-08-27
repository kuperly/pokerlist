(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('LoginController', LoginController);
 
    LoginController.$inject = ['$rootScope','$cookies','$location', 'AuthenticationService', 'FlashService','toastr'];
    function LoginController($rootScope,$cookies,$location, AuthenticationService, FlashService,toastr) {
        var vm = this;
 
        vm.login = login;
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.data.length) {
                    AuthenticationService.SetCredentials(response.data[0].username, response.data[0].password, response.data[0].role);
                    $rootScope.userLogIn = $cookies.getObject('globals');
                    $location.path('/');
                } else {
                    //FlashService.Error(response.message);
                    toastr.options = {"positionClass": "toast-top-center"};
                    toastr.info('username or password incorrect', 'error');
                    vm.dataLoading = false;
                }
            });
        };

    }
 
})();