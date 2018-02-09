app.controller('newGameController', function ($scope, gamesService, playerService,amountService,$http, toastr,ngDialog, UserService) {
    
    var defaultCashIn = 50;
    $scope.gameStatusOpen = 'Open';
    $scope.gameOpenDate = new Date();
    $scope.gameLocation = ''; // not in use
    $scope.addCashInAllEnable = true; // enable only at the begin, before cash in.
    $scope.sumForCashIn = defaultCashIn;
    $scope.sumForCashOut = 0;
    $scope.totalCashIn = 0;
    $scope.balance = 0;

    // will hold all the player for current game
    $scope.players = [];

    // Creat new game in DB and resived GameID - NEW GAME ONLY
    gamesService.newGame($scope.gameOpenDate,$scope.gameStatusOpen,$scope.gameLocation = '')
    .then(function (res) {
        $scope.gameID = res.data['_id'];
    });

    // Get all players list from DB
    playerService.getAllPlayers()
    .then(function (res) {
        angular.forEach(res.data,function(name) {
            name.show = true;
            name.id = name['_id'];
        })
        $scope.names = res.data;

        // Push all active players to players, will show at table. (NEW GAME ONLY)
        angular.forEach($scope.names,function(name) {
            if(name.status.toLowerCase() == 'active') {
                var obj = {
                    // 'playerName': name.username,
                    'fullName': name.Fname +" "+ name.Lname,
                    'cashIn': 0,
                    'cashOut': 0,
                    'activeCashIn': false,
                    'activeCashOut': false,
                    'id': name['_id'],
                    'total':0
                };
                name.show = false;
                $scope.players.push(obj);
            }
        });
    });

    // Add new player for current game
    $scope.addRow = function () {
        
        var obj = {
            'fullName': '',
            'cashIn': 0,
            'cashOut': 0,
            'activeCashIn': false,
            'activeCashOut': false,
            'id': "",
            'total':0
        };
        $scope.players.push(obj);
        
    };

    // Remove row
    $scope.removeRow = function (id) {
        if (confirm('Are you sure you want to remove player?')) {
            var index = -1;
            var comArr = eval($scope.players);

            // find player index in players Array
            // _.remove(comArr, {id: id});
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i].id === id) {
                    index = i;
                    break;
                }
            }
            $scope.players.splice(index, 1);

            // return to names DD the current player
            index = -1;
            if (id) {
                
                for (var i = 0; i < $scope.names.length; i++) {
                    if ($scope.names[i]["_id"] === id) {
                        $scope.names[i].show = true;
                        break;
                    }
                }

            }
            
            
        }
    };

    // Close game in DB
    $scope.closeGame = function() {

        if($scope.balance) {

            // alert("Can't close game with money in cashier");

            toastr.options = {"positionClass": "toast-top-center"};
            toastr.error("Can't close game with money in cashier", 'Error');
            return;

        } else if( !$scope.totalCashIn ) {
            // alert("Can't close game with no deposits");

            toastr.options = {"positionClass": "toast-top-center"};
            toastr.error("Can't close game with no deposits", 'Error');
            return;
        }


        if (confirm('Are you sure you want to close the game?')) {
            gamesService.closeGame($scope.gameID)
            .then(function (res) {
                $scope.gameStatusOpen = res.data['game_status'];
            });
            UserService.UpdateUsersStatus();
        }
    }

    // search userID and set it to player & set full name
    $scope.setIdToNames = function(id,userName) {

        if(userName != null) {

            var user = findNameIndex($scope.names,'id',userName);
            $scope.players[id]['fullName'] = $scope.names[user].Fname + " " + $scope.names[user].Lname; // add full name to player
            $scope.names[user].show = false;
        }
    }

    // return players index
    function findNameIndex(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++){
            if (arr[i][propName] == propValue)
                return i;
        }
    }

    // Add cashIn for all players that have no cashIn already in DB & UI
    $scope.addCashInAll = function () {
        var sum = defaultCashIn;

        if (confirm('You will Add ' + sum +' chips to all players, continue?')) {

            $scope.addCashInAllEnable = false; // disable CashInAllPlayers Button
            angular.forEach($scope.players, function (player,key) {
                if(player.cashIn === 0) {
                    $scope.CashIn(key,sum);
                }
            });
        }
    };

    // Set Cash In DB & UI
    $scope.CashIn = function (id,sum) {
        
        var obj = {
            user_id: $scope.players[id]['id'],
            user_name: $scope.players[id]['fullName'],
            game_id: $scope.gameID,
            cash_in: sum
        }

        amountService.setCashIn(obj)
        .then(function (res) {
            $scope.players[id].activeCashIn = false;
            $scope.players[id].cashIn += sum;
            $scope.totalCashIn += sum;
            $scope.balance += sum;
            $scope.players[id].total -= sum;
        });
    };

    // Set Cash Out DB & UI
    $scope.CashOut = function (id,sum) {

        if($scope.totalCashIn < sum) {
            toastr.options = {"positionClass": "toast-top-center"};
            toastr.error('The max deposit is ' + $scope.totalCashIn, 'Error');
            return;
        }
        
        var obj = {
            user_id: $scope.players[id]['id'],
            // user_name: $scope.players[id]['playerName'],
            user_name: $scope.players[id]['fullName'],
            game_id: $scope.gameID,
            cash_out: sum
        }

        amountService.setCashOut(obj)
        .then(function (res) {
            $scope.players[id].activeCashOut = false;
            $scope.players[id].cashOut += sum;
            $scope.balance -= sum;
            $scope.players[id].total += sum;
        });

    };

    // On destroy - delete empty game
    var destroy = $scope.$on('$destroy', function () {
                    
        if (!$scope.totalCashIn) {
            gamesService.deleteGame($scope.gameID)
            .then(function (res) {
                toastr.options = {"positionClass": "toast-top-center"};
                toastr.info('game deleted', 'Info');
                UserService.UpdateUsersStatus();
            });
            
        }
    });

    // $scope.destroy = function (e, toState, toParams, fromState, fromParams) {
    //     e.preventDefault();
    //     if (!$scope.totalCashIn) {

    //         gamesService.deleteGame($scope.gameID)
    //         .then(function (res) {
    //             toastr.options = {"positionClass": "toast-top-center"};
    //             toastr.info('game deleted', 'Info');
    //             UserService.UpdateUsersStatus();
    //             $state.go(toState);
    //         });
    //     } else{
    //         $state.go(toState);
    //     }
    // };

    // var destroy = $scope.$on('$stateChangeStart', destroy);


    // Dialog - Show player cash in for delete functionality
    $scope.showCash = function(ev,user) {
            
        var dialog = ngDialog.open({
            template: 'Templates/dialog_cash_tmpl.html',
            controller: 'userCashinDialog',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            $event: ev,
            data:{'gameID':$scope.gameID,'user': user}
        });
    };

});