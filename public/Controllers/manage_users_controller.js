app.controller('manageUsersController', function ($scope,$state,$cookies,UserService,AuthenticationService,gamesService,playerService,amountService, $q,$filter,$rootScope,toastr) {

    // players
    playerService.getAllPlayers()
    .then(function (res) {
        $scope.names = res.data;

        angular.forEach($scope.names,function(name,index){
            $scope.names[index].editable = false;
        })

    });

    // role values
    $scope.availableOptions = [
        {name: 'admin', id:2},
        {name: 'manager', id:1},
        {name: 'basic', id:0}
    ];

    // status values
    $scope.statusOptions = [
        {name: 'new', id:0},
        {name: 'not active', id:1},
        {name: 'active', id:2}
    ];

    // TODO - delete user
    $scope.delete = function(player) {
        UserService.Delete(player['_id'])
        .then(function(res){
            toastr.options = {"positionClass": "toast-top-center"};
            toastr.success('user deleted', 'info');
            $state.reload();
        });
    }

    // TODO - aprrove user 
    $scope.aprroveUser = function(player) {
        console.log(player);
    }


    // edit mode
    $scope.editRow = function(player) {
        console.log(player);
        player.editable = !player.editable;
    }


    // TODO - updete user
    $scope.save = function(player){

        console.log("player to save:",player);

         UserService.GetByUsername(player.username)
        .then(function(response){
            
            if(!response.data.length || (response.data.length == 1 && player['_id'] == response.data[0]['_id'])){
                // check if paswword changed
                
                UserService.Update(player)
                .then(function(res){
                    //AuthenticationService.SetCredentials(res.data.username,res.data.password,res.data.role);
                    //$rootScope.userLogIn = $cookies.getObject('globals');
                    //$state.go('account');
                    $state.reload();
                })
            } else {

                toastr.options = {"positionClass": "toast-top-center"};
                toastr.error('username alredy exist', 'error');
                return;

            }
        })
    }


});