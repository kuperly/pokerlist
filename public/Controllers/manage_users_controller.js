app.controller('manageUsersController', function ($scope,$state,$cookies,UserService,AuthenticationService,gamesService,playerService,amountService, $q,$filter,$rootScope,toastr) {

    // get all players
    playerService.getAllPlayers()
    .then(function (res) {
        $scope.names = res.data;

        angular.forEach($scope.names,function(name,index){
            $scope.names[index].editable = false;
        })

    });

    // value's role 
    $scope.availableOptions = [
        {name: 'admin', id:2},
        {name: 'manager', id:1},
        {name: 'basic', id:0}
    ];

    //  value's status 
    $scope.statusOptions = [
        {name: 'New', id:0},
        {name: 'Not active', id:1},
        {name: 'Active', id:2},
        {name: 'Guest', id:3}
    ];

    // delete user
    $scope.delete = function(player) {
        
        if (confirm('Are you sure you want to delete the account of '+ player.Fname + ' '+ player.Lname + '?')) {
            UserService.Delete(player['_id'])
            .then(function(res){
                toastr.options = {"positionClass": "toast-top-center"};
                toastr.success('user deleted', 'info');
                $state.reload();
            });
        }
    }

    // TODO - aprrove user 
    $scope.aprroveUser = function(player) {
        console.log(player);
    }


    // edit mode
    $scope.editRow = function(player) {
        player.editable = !player.editable;
    }


    // updete user
    $scope.save = function(player){

        console.log("player to save:",player);

         UserService.GetByUsername(player.username)
        .then(function(response){
            
            if(!response.data.length || (response.data.length == 1 && player['_id'] == response.data[0]['_id'])){
                // check if paswword changed
                
                UserService.Update(player)
                .then(function(res){
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