app.controller('editGameController', function ($scope, gamesService, playerService,amountService,$http,$q, toastr,$state,$stateParams) {

    console.log('editGameController');
    
    //$scope.gameStatusOpen = 'Open';
    //$scope.gameOpenDate = new Date();
    //$scope.gameLocation = '';
    $scope.gameID = $stateParams.id;
    $scope.addCashInAllEnable = false;
    $scope.sumForCashIn = 50;
    $scope.sumForCashOut = 0;
    $scope.totalCashIn = 0;
    $scope.balance = 0;

    $scope.players = [];

    playerService.getAllPlayers()
    .then(function (res) {
        // angular.forEach(res.data,function(name){
        //     name.show = true;
        // })
        $scope.names = res.data;

        // needed??
        // angular.forEach($scope.names,function(name) {
        //     var obj = {
        //         'name': name.username,
        //         'cash_in': 0,
        //         'cash_out': 0,
        //         'activeCashIn': false,
        //         'activeCashOut': false,
        //         'id': name['_id']
        //     };
        //     $scope.players.push(obj);
        // });
    });
    
    $scope.addRow = function () {
        
        var obj = {
            'name': '',
            'cash_in': 0,
            'cash_out': 0,
            'total':0,
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
            gamesService.closeGame($scope.gameID)
            .then(function (res) {
                $scope.gameInfo[0].game_status = res.data['game_status'];
            });
        }
    }

    $scope.setIdToNames = function(id,userName) {

        if(userName != null) {

            var user = findPlayerId($scope.names,'username',userName);
            $scope.players[id]['id'] = user["_id"];
            $scope.players[id]['name'] = user.Fname + " " + user.Lname ;

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

    function checkPlayerId(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++){
            if (arr[i][propName] == propValue)
                return false;
        }
        return true;
    }

    $scope.CashIn = function (id,sum) {
        
        var obj = {
            user_id: $scope.players[id]['id'],
            user_name: $scope.players[id]['name'],
            game_id: $scope.gameID,
            cash_in: sum
        }

        amountService.setCashIn(obj)
        .then(function (res) {
            $scope.players[id].activeCashIn = false;
            $scope.players[id].cash_in += sum;
            $scope.players[id].total -= sum;
            $scope.totalCashIn += sum;
            $scope.balance += sum;
        });
    };

    // OK
    $scope.CashOut = function (id,sum) {

        if($scope.totalCashIn < sum){
            toastr.options = {"positionClass": "toast-top-center"};
            toastr.error('The max deposit is ' + $scope.totalCashIn, 'Error');
            return;
        }

        var obj = {
            user_id: $scope.players[id]['id'],
            user_name: $scope.players[id]['name'],
            game_id: $scope.gameID,
            cash_out: sum
        }

        amountService.setCashOut(obj)
        .then(function (res) {
            $scope.players[id].activeCashOut = false;
            $scope.players[id].cash_out += sum;
            $scope.players[id].total += sum;
            $scope.balance -= sum;
        });

    };


    // ***** RESTORE DATA ***** //

    


    $scope.GameById = function(id){
        var promise = $q.defer();
        gamesService.getGame(id)
        .then(function(res){
            $scope.gameInfo = res.data;
            promise.resolve();
        });
        return promise.promise;
    }

    $scope.CashInByGameId = function(id){
        var promise = $q.defer();
        amountService.getCashInByGameId(id)
        .then(function(res){
            $scope.cashIn = res.data;
            promise.resolve();
        });
        return promise.promise;
    }

    $scope.CashOutByGameId = function(id){
        var promise = $q.defer();
        amountService.getCashOutByGameId(id)
        .then(function(res){
            $scope.cashOut = res.data;
            promise.resolve();
        });
        return promise.promise;
    }
    


    $scope.getData = function(id) {

        var promise = $q.defer();
        var allGetsArray = [];

        allGetsArray.push($scope.GameById(id));
        allGetsArray.push($scope.CashInByGameId(id));
        allGetsArray.push($scope.CashOutByGameId(id));

        $q.all(allGetsArray).then(function(){
            promise.resolve();
        })

        return promise.promise;

    }


    $scope.getData($scope.gameID).then(function(data){
        $scope.setData();
    });

    $scope.setData = function() {
        
        // players from cashIn
        angular.forEach($scope.cashIn,function(In) {
            var user = {name:In.user_name,id:In.user_id,cash_in:0,cash_out:0,total:0,activeCashIn:false,activeCashIn:false};
            if(!$scope.players.length){
                $scope.players.push(user);
            }else if(checkPlayerId($scope.players,'id',In.user_id)){ // return false if exist at players array
                $scope.players.push(user);
            }
        })

        // set cashIn to player
        angular.forEach($scope.players,function(player) {
            angular.forEach($scope.cashIn,function(In) {

                if(player.id == In.user_id){
                    player.cash_in += In.cash_in;
                    player.total -= In.cash_in;
                    $scope.totalCashIn += In.cash_in;
                    $scope.balance += In.cash_in;
                }
            })
            angular.forEach($scope.cashOut,function(Out) {

                if(player.id == Out.user_id){
                    player.cash_out += Out.cash_out;
                    player.total += Out.cash_out;
                    $scope.balance -= Out.cash_out;
                }
            })
        })
        console.log("Players:",$scope.players);
        console.log("gameInfo:",$scope.gameInfo);
    }


    

});