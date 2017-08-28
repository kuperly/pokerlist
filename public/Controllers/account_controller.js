app.controller('accountController', function ($cookies,AuthenticationService,UserService,$scope,gamesService,playerService,amountService, $q,toastr,$state,$rootScope) {
    
    $scope.user = {};

    UserService.GetByUsername($rootScope.userLogIn.currentUser.username)
    .then(function(response){
        $scope.user = response.data[0];
    })

    $scope.edit = function(){
        $state.go('edit_account');
    }

    $scope.cancel = function(){
        $state.go('account');
    }

    $scope.save = function(isValid){

         UserService.GetByUsername($scope.user.username)
        .then(function(response){
            
            if(!response.data.length || (response.data.length == 1 && $scope.user['_id'] == response.data[0]['_id'])){
                // check if paswword changed
                if($scope.password){
                    $scope.user.password = $scope.password;
                }
        
                UserService.Update($scope.user)
                .then(function(res){
                    AuthenticationService.SetCredentials(res.data.username,res.data.password,res.data.role);
                    $rootScope.userLogIn = $cookies.getObject('globals');
                    $state.go('account');
                })
            } else {

                toastr.options = {"positionClass": "toast-top-center"};
                toastr.error('username alredy exist', 'error');
                return;

            }
        })

         
        
    }
    

});