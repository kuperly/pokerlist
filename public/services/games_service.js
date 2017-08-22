app.factory('gamesService', function ($http) {

    return { 
        newGame: function (date,status,location) { // OK
            return $http({
                method:'POST',
                url:'http://localhost:3000/setNewGame',
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
                url:'http://localhost:3000/closeGame',
                headers: {'Content-Type' : 'application/json'},
                data: {
                    game_id : gameId
                }
            });

        },

        deleteGame: function (gameId) { // OK

            return $http({
                method:'POST',
                url:'http://localhost:3000/deleteGame',
                headers: {'Content-Type' : 'application/json'},
                data: {
                    game_id : gameId
                }
            });

        },

        getAllGames: function () { // OK
            return $http.get('http://localhost:3000/getAllGames');

        },

        getGame: function(ID){ // TODO

            var requestParam={
            method:'GET',
            params: {id: ID},
            url:'http://localhost:3000/getGame'
            }

            return $http(requestParam);
        }
    };
});