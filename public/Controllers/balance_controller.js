app.controller('balanceController', function ($scope,gamesService,playerService,amountService, $q,$filter) {

    $scope.players = [];
    $scope.games = [];
    $scope.cashIn = [];
    $scope.cashOut = [];

    // Table - sort & filter
    $scope.sortType     = ['balance','totalCashOut','totalCashIn']; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.searchAtTable   = '';     // set the default 

    $scope.showGuests = false;

    $scope.setData = function(){

        // player
        angular.forEach($scope.players,function(player) {
            player.totalGames = 0;
            player.totalCashIn = 0;
            player.totalCashOut = 0;
            player.gameId = [];


            // sum of cashIn
            angular.forEach($scope.cashIn,function(cashin){

                // sum of cashIn
                if(cashin.user_id == player['_id']){
                    player.totalCashIn += cashin.cash_in;
                }

                // sum of games

                if(cashin.user_id == player['_id'] && $scope.checkGame(cashin.game_id,player)) {
                    
                    player.totalGames += 1;
                    player.gameId.push(cashin.game_id);
                }

                

            })

            // sum of cashOut
            angular.forEach($scope.cashOut,function(cashout){
                if(cashout.user_id == player['_id']){
                    player.totalCashOut += cashout.cash_out;
                }
            })

            // balace
            player.balance = player.totalCashOut - player.totalCashIn;


        })

    };

    $scope.checkGame = function(game_id, player) {

        if(!player.gameId.length){
            return true;
        }

        var find = false;

        angular.forEach(player.gameId, function(game){
            
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


    // TODO
    $scope.getData = function() {

        var promise = $q.defer();
        var allGetsArray = [];

        allGetsArray.push($scope.getPlayers());
        allGetsArray.push($scope.getGames());
        allGetsArray.push($scope.getCashIn());
        allGetsArray.push($scope.getCashOut());

        $q.all(allGetsArray).then(function(){
            promise.resolve();
        })

        return promise.promise;

    }

    $scope.getPlayers = function(){
        var promise = $q.defer();
        playerService.getAllPlayers()
        .then(function (res) {
            $scope.players = res.data;
            promise.resolve();
        });
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

    $scope.getCashOut = function(){
        var promise = $q.defer();
        amountService.getAllCashOut()
        .then(function(res){
            $scope.cashOut = res.data;
            promise.resolve();
        });
        return promise.promise;
    }

    // get all data & set it
    $scope.showGuestchange = function(){

        $scope.getData().then(function(data) {
            $scope.setData();
            var p = [];
            // remove empty players from array
            angular.forEach($scope.players,function(player){
                if((player.status.toLowerCase() == 'guest' && $scope.showGuests) ||  player.status.toLowerCase() != 'guest' && player.totalCashIn != 0){
                    p.push(player);
                }
            })
            $scope.players = p;

        });
    }

    $scope.showGuestchange();


});