app.factory('playerService', function ($http) {

    return {
        getPlayer: function (id) { // TODO
            return $http.get('http://localhost:11368/api/players?playerId=' + id);

        },

        getAllPlayers: function () { // OK
            return $http.get('http://localhost:3000/getAllUsers');

        },

        postNewPlayer: function (name, pass) { // TODO
            return $http.post('http://localhost:11368/api/players?name=' + name + '&password=' + pass);
        }

    }
});