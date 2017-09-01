app.controller('newGameController', function ($scope, gamesService, playerService,amountService,$http, toastr) {

    $scope.gameStatusOpen = 'Open';
    $scope.gameOpenDate = new Date();
    $scope.gameLocation = '';
    $scope.addCashInAllEnable = true;
    $scope.sumForCashIn = 50;
    $scope.sumForCashOut = 0;
    $scope.totalCashIn = 0;
    $scope.balance = 0;

    $scope.players = [];

    gamesService.newGame($scope.gameOpenDate,$scope.gameStatusOpen,$scope.gameLocation = '')
    .then(function (res) {
        $scope.gameId = res.data['_id'];
    });

    playerService.getAllPlayers()
    .then(function (res) {
        angular.forEach(res.data,function(name){
            name.show = true;
        })
        $scope.names = res.data;

        // needed??
        angular.forEach($scope.names,function(name) {
            var obj = {
                'playerName': name.username,
                'cashIn': 0,
                'cashOut': 0,
                'active': false,
                'activeCashIn': false,
                'activeCashOut': false,
                'id': name['_id']
            };
            $scope.players.push(obj);
        });
    });

    
    $scope.addRow = function () {
        
        var obj = {
            'playerName': '',
            'cashIn': 0,
            'cashOut': 0,
            'active': false,
            'activeCashIn': false,
            'activeCashOut': false,
            'id': ""
        };
        $scope.players.push(obj);
        
    };

    $scope.removeRow = function (id) {
        if (confirm('Are you sure you want to remove '+ name + '?')) {
            var index = -1;
            var comArr = eval($scope.players);
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i].id === id) {
                    index = i;
                    break;
                }
            }
            $scope.players.splice(index, 1);
        }
    };

    $scope.EditRow = function (index) { 
        $scope.players[index].active = !$scope.players[index].active;
    }

    $scope.closeGame = function() {

        if (confirm('Are you sure you want to close the game?')) {
            gamesService.closeGame($scope.gameId)
            .then(function (res) {
                $scope.gameStatusOpen = res.data['game_status'];
            });
        }
    }

    $scope.setIdToNames = function(id,userName) {

        if(userName != null) {

            var user = findPlayerId($scope.names,'username',userName);
            $scope.players[id]['id'] = user["_id"];

        }
    }

    function findNameIndex(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++){
            if (arr[i][propName] == propValue)
                return i;
        }
    }

    function findPlayerId(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++){
            if (arr[i][propName] == propValue)
                return arr[i];
        }
    }


    $scope.addCashInAll = function () {
        var sum = 50;

        if (confirm('You will Add 50 chips to all players, continue?')) {
            $scope.addCashInAllEnable = false;
            angular.forEach($scope.players, function (player,key) {
                if(player.cashIn == 0){
                    $scope.CashIn(key,sum);
                }
                
            });
        }
    };

    $scope.CashIn = function (id,sum) {
        
        var obj = {
            user_id: $scope.players[id]['id'],
            user_name: $scope.players[id]['playerName'],
            game_id: $scope.gameId,
            cash_in: sum
        }

        amountService.setCashIn(obj)
        .then(function (res) {
            $scope.players[id].active = false;
            $scope.players[id].activeCashIn = false;
            $scope.players[id].cashIn += sum;
            $scope.totalCashIn += sum;
            $scope.balance += sum;
        });
    };

    $scope.CashOut = function (id,sum) {

        if($scope.totalCashIn < sum) {
            toastr.options = {"positionClass": "toast-top-center"};
            toastr.error('The max deposit is ' + $scope.totalCashIn, 'Error');
            return;
        }
        
        var obj = {
            user_id: $scope.players[id]['id'],
            user_name: $scope.players[id]['playerName'],
            game_id: $scope.gameId,
            cash_out: sum
        }

        amountService.setCashOut(obj)
        .then(function (res) {
            $scope.players[id].active = false;
            $scope.players[id].activeCashOut = false;
            $scope.players[id].cashOut += sum;
            $scope.balance -= sum;
        });

    };


    var destroy = $scope.$on('$destroy', function () {
                    
        if (!$scope.totalCashIn) {
            gamesService.deleteGame($scope.gameId)
            .then(function (res) {
                toastr.options = {"positionClass": "toast-top-center"};
                toastr.info('game deleted', 'info');
            });
        }
    });

    // function checkTotalCashIn(){
    //     var total = 0;
    //     angular.forEach($scope.players,function(player){
    //         total += player.cashIn;
    //     })
    //     return total;
    // }

    

});