app.controller('gamesController', function ($scope,gamesService,playerService,amountService, $q,toastr,$state,$rootScope) {
    
    console.log("gamesController start");

    $scope.players = [];
    $scope.games = [];
    $scope.cashIn = [];

    $scope.setData = function() {

        // player
        angular.forEach($scope.games,function(game) {
            game.totalPlayers = 0;
            game.totalCashIn = 0;
            game.players = [];


            // sum of cashIn
            angular.forEach($scope.cashIn,function(cashin){

                if(cashin.game_id == game['_id'])
                    game.totalCashIn += cashin.cash_in;

                // sum of players
                var answer = checkPlayer(cashin.user_id,game);

                if(answer == -1 && cashin.game_id == game['_id']) {
                    
                    game.totalPlayers += 1;
                    game.players.push(cashin.user_id);
                }
            })
        })

        console.log("players:",$scope.games);

    };

    function checkPlayer (user_id, game) {

        if(!game.players.length){
            return -1;
        }

        return game.players.indexOf(user_id);

    };


    
    $scope.getData = function() {

        var promise = $q.defer();
        var allGetsArray = [];

        allGetsArray.push($scope.getGames());
        allGetsArray.push($scope.getCashIn());

        $q.all(allGetsArray).then(function(){
            promise.resolve();
        })

        return promise.promise;

    }

    $scope.getGames = function(){
        var promise = $q.defer();
        gamesService.getAllGames()
        .then(function(res){
            $scope.games = res.data;
            promise.resolve();
        });
        return promise.promise;
    }

    $scope.getCashIn = function(){
        var promise = $q.defer();
        amountService.getAllCashIn()
        .then(function(res){
            $scope.cashIn = res.data;
            promise.resolve();
        });
        return promise.promise;
    }

    $scope.getData().then(function(data){
        $scope.setData();
    })


    $scope.removeGame = function(id){

        if (confirm('Are you sure you want to delete this game?')) {
            gamesService.deleteGame(id)
            .then(function (res) {
                toastr.options = {"positionClass": "toast-top-center"};
                toastr.info('game deleted', 'info');
                $state.reload();
            });
        }

    }

    $scope.gameDetails = function(game_id) {
        $state.go('game_details',{id: game_id});
    }

    $scope.editGame = function(game_id) {
        $state.go('edit_game',{id: game_id});
    }

});