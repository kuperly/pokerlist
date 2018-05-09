app.controller('balanceController', function ($scope,gamesService,playerService,amountService, $q,$filter) {
    $scope.showCharts = {flag:false,index:null};
    $scope.players = [];
    $scope.games = [];
    $scope.cashIn = [];
    $scope.cashOut = [];
    $scope.allTotalCashIn = 0;
    $scope.firstPlayer = null;
    $scope.timeInFirstPlace = null;

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        scales: {
        yAxes: [
            {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
            },
            {
            id: 'y-axis-2',
            type: 'linear',
            display: false,
            position: 'right'
            }
        ]
        }
    };

    // Table - sort & filter
    $scope.sortType     = ['balance','average','totalCashOut','totalCashIn']; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.searchAtTable   = '';     // set the default 

    $scope.showGuests = false;

    $scope.setData = function() {
        $scope.allTotalCashIn = 0;

        // player
        angular.forEach($scope.players,function(player) {
            player.totalGames = 0;
            player.totalCashIn = 0;
            player.totalCashOut = 0;
            player.gameId = [];

            
            // player.series = [];
            player.statIn = [];
            player.statOut = [];
            player.statTotal = [];
            
            // sum of cashIn
            angular.forEach($scope.cashIn,function(cashin) {

                // sum of cashIn
                if(cashin.user_id == player['_id']) {
                    player.totalCashIn += cashin.cash_in;

                    if($scope.showGuests || (!$scope.showGuests && player.status != 'Guest'))
                        $scope.allTotalCashIn += cashin.cash_in;
                }

                // sum of games
                if(cashin.user_id == player['_id'] && $scope.checkGame(cashin.game_id,player)) {
                    
                    player.totalGames += 1;
                    player.gameId.push(cashin.game_id);

                    

                    player.statIn.push({game_id: cashin.game_id, cash_in: cashin.cash_in, total: player.totalCashIn});
                } else if(cashin.user_id == player['_id'] && !$scope.checkGame(cashin.game_id,player)) {
                    // update object cashIn
                    // TODO - get game dates
                    player.statIn[player.totalGames - 1].total = player.totalCashIn;
                    player.statIn[player.totalGames - 1].cash_in += cashin.cash_in; 
                }

                

            })

            // sum of cashOut
            angular.forEach($scope.cashOut,function(cashout){
                if(cashout.user_id == player['_id']) {
                    player.totalCashOut += cashout.cash_out;
                    $scope.allTotalCashOut += cashout.cash_out;

                    // TODO - get game dates
                    player.statOut.push({game_id: cashout.game_id, cash_out: cashout.cash_out ,total: player.totalCashOut});
                }
            })


            // balace
            player.balance = player.totalCashOut - player.totalCashIn;

            // average
            player.average = parseInt(player.balance / player.totalGames);

            // present
            player.present = (player.balance / player.totalCashIn * 100);

            // fisrt player
            $scope.firstPlayer = findFirstPlayer();
            updateSeriesForAllPlayers($scope.firstPlayer);

            // set statistics arr
            $scope.setStat(player);

        })

        
        //$scope.timeInPlace = gameInFirstPlace($scope.firstPlayer);

        console.log('Players:',$scope.players);
        // console.log('Games:',$scope.games);
    };

    $scope.setStat = function (player) {

        var flag = false;

        for(var i=0; i< player.statIn.length; i++) {
            flag = false;
            for(var out=0; out< player.statOut.length; out++) {

                if(player.statIn[i].game_id == player.statOut[out].game_id){
                    flag = true;
                    player.statTotal.push({game_id: player.statIn[i].game_id, cash_in: player.statIn[i].cash_in, cash_out: player.statOut[out].cash_out, totalForGame: (player.statOut[out].cash_out - player.statIn[i].cash_in), total: (player.statOut[out].total - player.statIn[i].total)});

                }

            }

            if (!flag) {

                player.statTotal.push({game_id: player.statIn[i].game_id, cash_in: player.statIn[i].cash_in, cash_out: 0, totalForGame: (0 - player.statIn[i].cash_in), total: player.statTotal.length ? (player.statTotal[player.statTotal.length - 1].total - player.statIn[i].cash_in) : (0-player.statIn[i].cash_in) });
            }

        }


        // $scope.labels ["One", "two", "Tree"]
        var me = [];
        var first = [];
        var wins = 0, lose = 0, even = 0;
        player.labels = [];
        player.labelsPie = ["Win", "Even", "Lose"];
        // $scope.series = ["Me", '1ST'];
        player.data = [];
        player.dataPie = [];
        player.maxOut = 0;
        player.maxIn = 0;
        player.maxWin = 0;
        player.maxLose = 0;
        for(var i=0; i<player.statTotal.length; i++) {
            player.labels.push("game " + (i + 1));
            me.push(player.statTotal[i].total);
            // first.push(player.statTotal[i].total);

            // maxIn
            if(player.statTotal[i].cash_in > player.maxIn) {
                player.maxIn = player.statTotal[i].cash_in;
            }

            // maxOut
            if (player.statTotal[i].cash_out > player.maxOut){
                player.maxOut = player.statTotal[i].cash_out;
            }

            // maxWin
            if (player.statTotal[i].totalForGame > player.maxWin) {
                player.maxWin = player.statTotal[i].totalForGame;
            }

            // maxLose
            if (player.statTotal[i].totalForGame < player.maxLose) {
                player.maxLose = player.statTotal[i].totalForGame;//Math.abs(player.statTotal[i].totalForGame);
            }

            if(player.statTotal[i].totalForGame > 0) {
                wins ++;
            } else if(player.statTotal[i].totalForGame < 0) {
                lose ++;
            } else {
                even++;
            }
        }
        player.maxLose = Math.abs(player.maxLose);
        player.dataPie.push(wins);
        player.dataPie.push(even);
        player.dataPie.push(lose);

        player.data.push(me);
        // player.data.push($scope.firstPlayer.data[0]);

    }

    $scope.setPlayerForStat = function (player) {

        // hige if click again on same player name..

        for(var i=0; i<$scope.players.length; i++) {

            if(player._id == $scope.players[i]._id) {
                if($scope.showCharts.index == i) {
                    $scope.showCharts.flag = !$scope.showCharts.flag;
                } else {
                    $scope.showCharts.flag = true;
                }
                $scope.showCharts.index = i;
                $scope.blurPlayerForStat = $scope.players[i];
            }

        }

        

    }

    function findFirstPlayer() {
        var maxProfit = 0;
        var playerPositionInArr = null;
        for(var i=0; i<$scope.players.length; i++) {

            if($scope.players[i].balance > maxProfit && 
                (($scope.players[i].status.toLowerCase() == 'active' && !$scope.showGuests) || $scope.showGuests)) {
                maxProfit = $scope.players[i].balance;
                playerPositionInArr = i;
            }

        }
        return $scope.players[playerPositionInArr];
    }

    function updateSeriesForAllPlayers(firstPlayer) {

        for (var i=0; i<$scope.players.length; i++) {

            if(!$scope.players[i].series) {
                $scope.players[i].series = [];
            }

            if(!$scope.players[i].series.length) {
                $scope.players[i].series.push($scope.players[i].Fname + " " + $scope.players[i].Lname);
                // $scope.players[i].series.push(firstPlayer.Fname + " " + firstPlayer.Lname);
            }
            

        }

    }

    // TODO - not ready
    function gameInFirstPlace(firstPlayer) {
        timeInFirst = 1;
        // gamesList reverse
        for(var game=$scope.games.length-1; game>0; game--) {

            // find max profit player for every game round
            for(var player=0; player<$scope.players.length; player++) {

                //check if bigger then first player

            }

        }
        

    }

    $scope.findGameIdInArr = function (game_id,arr) {

        for(var i=0; i<arr.length; i++) {
            if(game_id == arr[i]){
                return true;
            }
        }

        return false;

    }

    $scope.checkGame = function(game_id, player) {

        if(!player.gameId.length) {
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
    $scope.showGuestchange = function() {

        $scope.getData().then(function(data) {
            $scope.setData();
            var p = [];
            // remove empty players from array
            angular.forEach($scope.players,function(player){
                if((player.status.toLowerCase() == 'guest' && $scope.showGuests) ||  player.status.toLowerCase() != 'guest' &&  player.status.toLowerCase() == 'active' && player.totalCashIn != 0){
                    p.push(player);
                }
            })
            $scope.players = p;

        });
    }

    $scope.showGuestchange();


});