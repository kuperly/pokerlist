app.factory('amountService', function ($http) {

    return { 
        setCashIn: function (obj) { // OK

            return $http({
                method:'POST',
                url:'http://localhost:3000/setCashIn',
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
                url:'http://localhost:3000/setCashOut',
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
            return $http.get('http://localhost:3000/getAllCashIn');

        },

        getAllCashOut: function () { // OK
            return $http.get('http://localhost:3000/getAllCashOut');

        },

        getCashInByGameId: function(ID){ // OK

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'http://localhost:3000/getCashInByGameId'
            }

            return $http(requestParam);
        },

        getCashOutByGameId: function(ID){ // TODO

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'http://localhost:3000/getCashOutByGameId'
            }

            return $http(requestParam);
        }

    }
});
