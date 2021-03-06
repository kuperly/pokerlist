var editedGame = function() {
    return {
        restrict:'AE',
        templateUrl: 'Templates/edited_game_tmp.html',
        scope: {
            page: "@"
        },
        link: function(scope, element, attributes, $scope, gamesService, playerService,amountService,$q, toastr,$state,$stateParams,ngDialog) {
             

            $scope.addCashInAllEnable = true; // enable only at the begin, before cash in.
            $scope.sumForCashIn = defaultCashIn;
            $scope.sumForCashOut = 0;
            $scope.totalCashIn = 0;
            $scope.balance = 0;

            // will hold all the player for current game
            $scope.players = [];

            // new 
            if(scope.page == 'new'){

                $scope.gameStatusOpen = 'Open';
                $scope.gameOpenDate = new Date();
                $scope.gameLocation = ''; // not in use

                gamesService.newGame($scope.gameOpenDate,$scope.gameStatusOpen,$scope.gameLocation = '')
                .then(function (res) {
                    $scope.gameID = res.data['_id'];
                });

            }

            // edit
            if(scope.page == 'edit'){

                $scope.gameID = $stateParams.id;

                // ***** RESTORE DATA ***** //

                $scope.GameById = function(id){
                    var promise = $q.defer();
                    gamesService.getGame(id)
                    .then(function(res) {
                        $scope.gameInfo = res.data;
                        $scope.gameStatusOpen = $scope.gameInfo[0].game_status;
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
        
    
                // get Data for current game (cashIn & cashOut & game info)
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
    

                // Play GetData function
                $scope.getData($scope.gameID).then(function(data) {
                    $scope.setData();
                });

                // Set data that recived from DB
                $scope.setData = function() {
        
                    // players from cashIn
                    angular.forEach($scope.cashIn,function(In) {
                        var user = {fullName:In.user_name,id:In.user_id,cashIn:0,cashOut:0,total:0,activeCashIn:false,activeCashOut:false};
                        var index = -1;
                        for(var i=0 ; i < $scope.names.length; i++){
                            if($scope.names[i]['_id'] == user.id ){
                                index = i;
                            }
                        }

                        // add to players Array names that already in the game & hide from names DD
                        if (!$scope.players.length) {
                            $scope.names[index].show = false;
                            $scope.players.push(user);
                        } else if(!(existInArr($scope.players,'id',In.user_id))){ // return true if exist at players array
                            $scope.names[index].show = false;
                            $scope.players.push(user);
                        }
                    })

                    // set cashIn & cashOut to players
                    angular.forEach($scope.players,function(player) {

                        // set cashIn
                        angular.forEach($scope.cashIn,function(In) {

                            if(player.id == In.user_id){
                                player.cashIn += In.cash_in;
                                player.total -= In.cash_in;
                                $scope.totalCashIn += In.cash_in;
                                $scope.balance += In.cash_in;
                            }
                        })

                        // set cashOnt
                        angular.forEach($scope.cashOut,function(Out) {

                            if(player.id == Out.user_id){
                                player.cashOut += Out.cash_out;
                                player.total += Out.cash_out;
                                $scope.balance -= Out.cash_out;
                            }
                        })
                    })
                }

            }

            // global functions
            playerService.getAllPlayers()
            .then(function (res) {
                angular.forEach(res.data,function(name) {
                    name.show = true;
                    name.id = name['_id'];
                })
                $scope.names = res.data;
        
                // Push all active players to players, will show at table. (NEW GAME ONLY)
                if(scope.page == 'new'){

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

                }
                
            });

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

            // remove row
            $scope.removeRow = function (id) {
                if (confirm('Are you sure you want to remove player?')) {
                    var index = -1;
                    var comArr = eval($scope.players);
        
                    // find player index in players Array
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
                
                if (confirm('Are you sure you want to close the game?')) {
                    gamesService.closeGame($scope.gameID)
                    .then(function (res) {
                        $scope.gameStatusOpen = res.data['game_status'];
                    });
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

            // Check if value exist in current Array (EDIT ONLY)
            function existInArr(arr, propName, propValue) {
                for (var i=0; i < arr.length; i++){
                    if (arr[i][propName] == propValue)
                        return true;
                }
                return false;
            }

            // Add cashIn for all players that have no cashIn already in DB & UI
            $scope.addCashInAll = function () {
                var sum = defaultCashIn;
        
                if (confirm('You will Add ' + sum +' chips to all players, continue?')) {
        
                    $scope.addCashInAllEnable = false; // disable CashInAllPlayers Button
                    angular.forEach($scope.players, function (player,key) {
                        if(player.cashIn == 0) {
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

            //On destroy - delete empty game
            var destroy = $scope.$on('$destroy', function () {
                
                if (!$scope.totalCashIn) {
                    gamesService.deleteGame($scope.gameID)
                    .then(function (res) {
                        toastr.options = {"positionClass": "toast-top-center"};
                        toastr.info('game deleted', 'info');
                    });
                }
            });

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

            

        }
    };
};
 
app.directive("editedGame", editedGame);



// @ -> string
// = -> property
// & -> function
