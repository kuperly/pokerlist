app.factory('playerService', function ($http) {

    return {

        getAllPlayers: function () { // OK
            return $http.get('/api/getAllUsers')
                .then(function (res) {
                    // return initPlayers(res)
                    return res
                });
        },
        initPlayers: function (data) {
            var goodData = data
            return goodData
        },
        postNewPlayer: function (name, pass) { // ok
            return $http.post('/api/players?name=' + name + '&password=' + pass);
        }

    }
});