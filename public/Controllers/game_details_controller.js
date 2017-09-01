app.controller('GameDetailsController', function ($scope, gamesService, playerService,amountService,$http,$q, toastr,$stateParams) {

    $scope.totalCashIn = 0;
    $scope.gameID = $stateParams.id;

    $scope.players = [];

    $scope.setIdToNames = function(id,userName) {

        if(userName != null) {

            var user = findPlayerId($scope.names,'username',userName);
            $scope.players[id]['_id'] = user["_id"];

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
    

    $scope.GameById = function(id){
        var promise = $q.defer();
        gamesService.getGame(id)
        .then(function(res){
            $scope.gameInfo = res.data;
            console.log(res.data);
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
    })



    $scope.setData = function() {
        
        // players from cashIn
        angular.forEach($scope.cashIn,function(In) {
            var user = {name:In.user_name,id:In.user_id,cash_in:0,cash_out:0,total:0};
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
                }
            })
            angular.forEach($scope.cashOut,function(Out) {

                if(player.id == Out.user_id){
                    player.cash_out += Out.cash_out;
                    player.total += Out.cash_out;
                }
            })
        })
        console.log("Players:",$scope.players);
        console.log("gameInfo:",$scope.gameInfo);
    }

});