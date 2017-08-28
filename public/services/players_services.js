app.factory('playerService', function ($http) {

    return {
        
        getAllPlayers: function () { // OK
            return $http.get('/api/getAllUsers');

        },

        postNewPlayer: function (name, pass) { // ok
            return $http.post('/api/players?name=' + name + '&password=' + pass);
        }

    }
});