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

    $scope.save = function(){
        // console.log("to update:",$scope.user);
        UserService.Update($scope.user)
        .then(function(res){
            AuthenticationService.SetCredentials(res.data.username,res.data.password,res.data.role);
            $rootScope.userLogIn = $cookies.getObject('globals');
            $state.go('account');
        })
        
    }
    

});