(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$http','gamesService','playerService','amountService','$q','$rootScope'];
    function UserService($http,gamesService,playerService,amountService,$q,$rootScope) {
        var service = {};
 
//         service.GetAll = GetAll;
//         service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.UpdateUsersStatus = UpdateUsersStatus;
        
 
        return service;
 
//         function GetAll() {
//             return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
//         }
 
//         function GetById(id) {
//             return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
//         }
            

        function GetByUsername(name) {
            return $http.post('/api/username/', {username:name})
            .then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }
 
        function Update(user) {
            return $http.post('/api/updateuser/', user).then(handleSuccess, handleError('Error updating user'));
        }
 
//         function Delete(id) {
//             return $http.delete('/api/deleteUser/' + id).then(handleSuccess, handleError('Error deleting user'));
//         }


        function UpdateUsersStatus() {

            var players = [];
            var games = [];
            var cashIn = [];
            var cashOut = [];

            function getData() {

                var promise = $q.defer();
                var allGetsArray = [];
        
                allGetsArray.push(getPlayers());
                allGetsArray.push(getGames());
                allGetsArray.push(getCashIn());
                allGetsArray.push(getCashOut());
        
                $q.all(allGetsArray).then(function(){
                    promise.resolve();
                })
        
                return promise.promise;
        
            }
            
            function getPlayers(){
                var promise = $q.defer();
                playerService.getAllPlayers()
                .then(function (res) {
                    players = res.data;
                    promise.resolve();
                });
                return promise.promise;
            }
        
            function getGames(){
                var promise = $q.defer();
                gamesService.getAllGames()
                .then(function(res){
                    games = res.data;
                    promise.resolve();
                });
                return promise.promise;
            }
        
            function getCashIn(){
                var promise = $q.defer();
                amountService.getAllCashIn()
                .then(function(res){
                    cashIn = res.data;
                    promise.resolve();
                });
                return promise.promise;
            }
        
            function getCashOut(){
                var promise = $q.defer();
                amountService.getAllCashOut()
                .then(function(res){
                    cashOut = res.data;
                    promise.resolve();
                });
                return promise.promise;
            }

            function setData() {
        
                // player
                angular.forEach(players,function(player) {
                    player.totalGames = 0;
                    player.totalCashIn = 0;
                    player.totalCashOut = 0;
                    player.gameId = [];
                    
        
        
                    // sum of cashIn
                    angular.forEach(cashIn,function(cashin){
        
                        // sum of cashIn
                        if(cashin.user_id == player['_id']){
                            player.totalCashIn += cashin.cash_in;
                        }
        
                        // sum of games
        
                        if(cashin.user_id == player['_id'] && checkGame(cashin.game_id,player)) {
                            
                            player.totalGames += 1;
                            player.gameId.push(cashin.game_id);
                        }
        
                    })
        
                    // sum of cashOut
                    angular.forEach(cashOut,function(cashout){
                        if(cashout.user_id == player['_id']){
                            player.totalCashOut += cashout.cash_out;
                        }
                    })
        
                    // balace
                    player.balance = player.totalCashOut - player.totalCashIn;
        
                    // average
                    player.average = parseInt(player.balance / player.totalGames);
        
                    // present
                    player.present = (player.balance / player.totalCashIn * 100);
                    
                })
        
            };

            function checkGame (game_id, player) {

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

            getData().then(function(data) {
                setData();
                var p = [];
                // remove empty players from array
                angular.forEach(players,function(player){
                    if(player.totalCashIn != 0){
                        p.push(player);
                    }
                })
                players = p;
                // return p;

                // set in DB if needed
                angular.forEach(players,function(player){
                    if( (player.totalGames / games.length) < 0.5 && player.status.toLowerCase() == 'active' ){
                        player.status = 'Guest';
                        service.Update(player);
                    } else if( (player.totalGames / games.length) >= 0.5 && player.status.toLowerCase() != 'active' ){
                        player.status = 'Active';
                        service.Update(player);
                    }
                })

            });



        }

        function Delete(userId) {

            return $http({
                method:'POST',
                url:'/api/deleteUser',
                headers: {'Content-Type' : 'application/json'},
                data: {
                    id : userId
                }
            });

        }
 
        // private functions
 
        function handleSuccess(res) {
            return res;
        }
 
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
 
})();