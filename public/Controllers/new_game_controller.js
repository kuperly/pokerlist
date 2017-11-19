app.controller('newGameController', function ($scope, gamesService, playerService,amountService,$http, toastr,ngDialog) {
    var defaultCashIn = 50;
    $scope.gameStatusOpen = 'Open';
    $scope.gameOpenDate = new Date();
    $scope.gameLocation = '';
    $scope.addCashInAllEnable = true;
    $scope.sumForCashIn = defaultCashIn;
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
            if(name.status.toLowerCase() == 'active'){
                var obj = {
                    'playerName': name.username,
                    'fullName': name.Fname +" "+ name.Lname,
                    'cashIn': 0,
                    'cashOut': 0,
                    'active': false,
                    'activeCashIn': false,
                    'activeCashOut': false,
                    'id': name['_id']
                };
                name.show = false;
                $scope.players.push(obj);
            }
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
            if (id){
                
                for(var i = 0; i < $scope.names.length; i++){
                    if(id == $scope.names[i]["_id"]){
                        $scope.names[i].show = true;
                    }
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
            $scope.players[id]['fullName'] = user.Fname + " " + user.Lname; // add full name to player

            for(var i = 0; i < $scope.names.length; i++){
                if($scope.players[id]['id'] == $scope.names[i]["_id"]) {
                    $scope.names[i].show = false;
                }
            }

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
            if (arr[i][propName] == propValue){
                //arr[i].show = false;
                return arr[i];
            }
                
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
            user_name: $scope.players[id]['fullName'],
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
            $scope.sumForCashIn = defaultCashIn;
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


        // Dialog
        $scope.showCash = function(ev,user) {
            
            var dialog = ngDialog.open({
                template: 'Templates/dialog_cash_tmpl.html',
                controller: 'userCashinDialog',
                className: 'ngdialog-theme-plain',
                scope: $scope,
                $event: ev,
                data:{'gameID':$scope.gameId,'user': user}
            });
        };

});


// app.controller('userCashinDialog', function($scope,amountService,ngDialog) {
    
//     var user = $scope.ngDialogData.user;
//     var game = $scope.ngDialogData.gameID;
    
//     amountService.getUserCashInByGame($scope.gameId,user.id).then (function(res) {
        
//         $scope.userCash = res.data;

//     });

//     $scope.daleteCashIn = function (id,index) {

//         amountService.deleteUserCashIn (id).then(function(res){

//             // TODO - Add popup message
//             if(res.status == 200){

//                 $scope.$parent.players[$scope.players.indexOf(user)].cashIn -= res.data.cash_in;
//                 $scope.$parent.totalCashIn -= res.data.cash_in;
//                 $scope.$parent.balance -= res.data.cash_in;
//                 $scope.userCash.splice(index,1);

//                 console.log('totalCashIn from dialog',$scope.$parent.totalCashIn);


//             }
            
//         });

//     }
    
//   });