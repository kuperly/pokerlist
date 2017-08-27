app.factory('gamesService', function ($http) {

    return { 
        newGame: function (date,status,location) { // OK
            return $http({
                method:'POST',
                url:'/setNewGame',
                headers: {'Content-Type' : 'application/json'},
                data: { 
                    game_date : date,
                    game_status : status,
                    game_location : location
                }
            });

        },
        
        closeGame: function (gameId) { // OK

            return $http({
                method:'POST',
                url:'/closeGame',
                headers: {'Content-Type' : 'application/json'},
                data: {
                    game_id : gameId
                }
            });

        },

        deleteGame: function (gameId) { // OK

            return $http({
                method:'POST',
                url:'/deleteGame',
                headers: {'Content-Type' : 'application/json'},
                data: {
                    game_id : gameId
                }
            });

        },

        getAllGames: function () { // OK
            return $http.get('/getAllGames');

        },

        getGame: function(ID){ // TODO

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'/getGame'
            }

            return $http(requestParam);
        }
    };
});