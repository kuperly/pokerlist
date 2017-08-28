(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('RegisterController', RegisterController);
 
    RegisterController.$inject = ['UserService','toastr', '$location', '$rootScope', 'FlashService','$scope'];
    function RegisterController(UserService, toastr, $location, $rootScope, FlashService, $scope) {
        var vm = this;
 
        vm.register = register;
 
        function register() {


            UserService.GetByUsername(vm.user.username)
            .then(function(response){
            
            if(!response.data.length) {
                // check if paswword changed
                
                vm.dataLoading = true;
            
                UserService.Create(vm.user)
                .then(function (response) {
                    if (response.status == 200) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
                
                
            } else {

                toastr.options = {"positionClass": "toast-top-center"};
                toastr.error('username alredy exist', 'error');
                return;

            }
        })



            
        }
    }
 
})();