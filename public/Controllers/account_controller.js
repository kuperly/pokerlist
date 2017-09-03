app.controller('accountController', function ($cookies,AuthenticationService,UserService,$scope,gamesService,playerService,amountService, $q,toastr,$state,$rootScope) {
    
    $scope.user = {};
    $scope.user.totalCashIn = 0;
    $scope.user.gamesID = {};

    

    $scope.loadData = function(){
        UserService.GetByUsername($rootScope.userLogIn.currentUser.username)
            .then(function(response){
                $scope.user = response.data[0];
                $scope.user.gamesID = [];
                $scope.user.totalGames = 0;

                $scope.roleToShow();

                amountService.getUserCashIn($scope.user['_id'])
                    .then(function(res){
                        
                        var sum = 0;
                        angular.forEach(res.data, function(val) {

                            // sum of cashIn
                            sum += val.cash_in;

                            // sum of games
                            if($scope.checkGameArray(val.game_id,$scope.user)) {
                                $scope.user.totalGames += 1;
                                $scope.user.gamesID.push(val.game_id);
                            }
                        });

                        $scope.user.totalCashIn = sum;


                        
                    
                
                    });

                amountService.getUserCashOut($scope.user['_id'])
                    .then(function(res){
                        var sum = 0;
                        angular.forEach(res.data, function(val){
                            sum += val.cash_out;
                        })

                        $scope.user.totalCashOut = sum;
                    });

                console.log($scope.user);

    })
    }

    $scope.loadData();

    $scope.edit = function(){
        $state.go('edit_account');
    }

    $scope.cancel = function(){
        $state.go('account');
    }

    $scope.save = function(isValid){

        console.log("user to save:",$scope.user);
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


    $scope.checkGameArray = function(game_id, player) {

        if(!$scope.user.gamesID.length){
            return true;
        }

        var find = false;

        angular.forEach($scope.user.gamesID, function(game) {
            
            if(game_id == game){
                find = true;
            }
        });
        if(!find){
            return true;
        } else {
            return false;
        }
        

    };
    
    $scope.roleToShow = function(){
        var role = $scope.user.role;

        switch(role) {
            case '0': $scope.user.roleS = 'Basic'; break;
            case '1': $scope.user.roleS = 'mMnager'; break;
            case '2': $scope.user.roleS = 'Admin'; break;
        }
    };

});