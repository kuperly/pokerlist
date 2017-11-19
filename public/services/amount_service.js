app.factory('amountService', function ($http) {

    return { 
        setCashIn: function (obj) { // OK

            return $http({
                method:'POST',
                url:'/api/setCashIn',
                headers: {'Content-Type' : 'application/json'},
                data: { 
                    user_id: obj.user_id,
                    user_name: obj.user_name,
                    game_id: obj.game_id,
                    cash_in: obj.cash_in
                }
            });

        },
        setCashOut: function (obj) { // OK

            return $http({
                method:'POST',
                url:'/api/setCashOut',
                headers: {'Content-Type' : 'application/json'},
                data: { 
                    user_id: obj.user_id,
                    user_name: obj.user_name,
                    game_id: obj.game_id,
                    cash_out: obj.cash_out
                }
            });

        },

        getAllCashIn: function () { // OK
            return $http.get('/api/getAllCashIn');

        },

        getUserCashIn: function (ID) { // OK

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'/api/getUserCashIn'
            }

            return $http(requestParam);



        },
        getUserCashInByGame: function (game,user) { // TODO
            
                        var requestParam={
                        method:'GET',
                        params: {id: game,uid:user},
                        url:'/api/getCashInByGameIdAndUID'
                        }
            
                        return $http(requestParam);
                    },

        getAllCashOut: function () { // OK
            return $http.get('/api/getAllCashOut');

        },
        deleteUserCashIn: function (cashIn_id) { // OK
            
                        return $http({
                            method:'POST',
                            url:'/api/deleteUserCashIn',
                            headers: {'Content-Type' : 'application/json'},
                            data: { id: cashIn_id }
                        });
            
                    },

        getUserCashOut: function (ID) { // OK
            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'/api/getUserCashOut'
            }

            return $http(requestParam);

        },

        getCashInByGameId: function(ID){ // OK

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'/api/getCashInByGameId'
            }

            return $http(requestParam);
        },

        getCashOutByGameId: function(ID){ // OK

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'/api/getCashOutByGameId'
            }

            return $http(requestParam);
        }

    }
});
