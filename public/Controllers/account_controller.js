app.controller('accountController', function ($cookies,AuthenticationService,UserService,$scope,gamesService,playerService,amountService, $q,toastr,$state,$rootScope) {
    
    $scope.user = {};
    $scope.user.totalCashIn = 0;
    $scope.user.gamesID = {};


    $scope.tabs = [
        {name: 'My details', isActive:true},
        {name: 'Statistics', isActive:false}
    ];

    $scope.setActiveTab = function (index) {
        
        for (var i=0; i<$scope.tabs.length; i++) {
            if(i == index) {
                $scope.tabs[i].isActive = true;
            } else {
                $scope.tabs[i].isActive = false;
            }
        }

    };
    $scope.labelsPie = ["Win", "Even", "Lose"];
    $scope.dataPie = [];
    $scope.labels = [];
    $scope.data = [];
    $scope.series = [];

  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };


    $scope.loadData = function() {
        UserService.GetByUsername($rootScope.userLogIn.currentUser.username)
            .then(function(response){
                $scope.user = response.data[0];
                $scope.user.gamesID = [];
                $scope.user.totalGames = 0;

                $scope.user.statIn = [];
                $scope.user.statOut = [];
                $scope.user.statTotal = [];
                $scope.series = ["Me", '1ST'];
                $scope.roleToShow();

                

                // promise all
                $q.all([
                    $scope.getCashIn($scope.user['_id']),
                    $scope.getCashOut($scope.user['_id'])
                ]).then(function(res) {

                    $scope.setStat();

                })
    })
    }

    $scope.setStat = function () {

        var flag = false;

        for(var i=0; i< $scope.user.statIn.length; i++) {
            flag = false;
            for(var out=0; out< $scope.user.statOut.length; out++) {

                if($scope.user.statIn[i].game_id == $scope.user.statOut[out].game_id){
                    flag = true;
                    $scope.user.statTotal.push({game_id: $scope.user.statIn[i].game_id, cash_in: $scope.user.statIn[i].cash_in, cash_out: $scope.user.statOut[out].cash_out, totalForGame: ($scope.user.statOut[out].cash_out - $scope.user.statIn[i].cash_in), total: ($scope.user.statOut[out].total - $scope.user.statIn[i].total)});

                }

            }

            if (!flag) {

                $scope.user.statTotal.push({game_id: $scope.user.statIn[i].game_id, cash_in: $scope.user.statIn[i].cash_in, cash_out: 0, totalForGame: (0 - $scope.user.statIn[i].cash_in), total: $scope.user.statTotal.length ? ($scope.user.statTotal[$scope.user.statTotal.length-1].total - $scope.user.statIn[i].cash_in) : (0-$scope.user.statIn[i].cash_in) });
            }

        }


        // $scope.labels ["One", "two", "Tree"]
        var me = [];
        var first = [];
        var wins = 0, lose = 0, even = 0;
        $scope.maxOut = 0;
        $scope.maxIn = 0;
        $scope.maxWin = 0;
        $scope.maxLose = 0;
        for(var i=0; i<$scope.user.statTotal.length; i++) {
            $scope.labels.push("game " + (i + 1));
            me.push($scope.user.statTotal[i].total);
            first.push($scope.user.statTotal[i].total);

            // maxIn
            if($scope.user.statTotal[i].cash_in > $scope.maxIn) {
                $scope.maxIn = $scope.user.statTotal[i].cash_in;
            }

            // maxOut
            if ($scope.user.statTotal[i].cash_out > $scope.maxOut){
                $scope.maxOut = $scope.user.statTotal[i].cash_out;
            }

            // maxWin
            if ($scope.user.statTotal[i].totalForGame > $scope.maxWin) {
                $scope.maxWin = $scope.user.statTotal[i].totalForGame;
            }

            // maxLose
            if ($scope.user.statTotal[i].totalForGame < $scope.maxLose) {
                $scope.maxLose = $scope.user.statTotal[i].totalForGame; // Math.abs($scope.user.statTotal[i].totalForGame);
            }

            if($scope.user.statTotal[i].totalForGame > 0) {
                wins ++;
            } else if($scope.user.statTotal[i].totalForGame < 0) {
                lose ++;
            } else {
                even++;
            }
        }

        $scope.maxLose = Math.abs($scope.maxLose);
        $scope.dataPie.push(wins);
        $scope.dataPie.push(even);
        $scope.dataPie.push(lose);

        $scope.data.push(me);
        $scope.data.push(first);
    }

    $scope.getCashIn = function(id) {

        var deferred = $q.defer();

        amountService.getUserCashIn(id)
        .then(function(res) {
            
            var sum = 0;
            angular.forEach(res.data, function(val) {

                // sum of cashIn
                sum += val.cash_in;

                

                // sum of games
                if($scope.checkGameArray(val.game_id,$scope.user)) {
                    $scope.user.totalGames += 1;
                    $scope.user.gamesID.push(val.game_id);

                    // TODO - get game dates
                    $scope.user.statIn.push({game_id: val.game_id, cash_in: val.cash_in, total: sum});

                } else {
                    
                    // update object cashIn
                    // TODO - get game dates
                    $scope.user.statIn[$scope.user.totalGames - 1].total = sum;
                    $scope.user.statIn[$scope.user.totalGames - 1].cash_in += val.cash_in; 
                }
            });
            $scope.user.totalCashIn = sum;

            deferred.resolve();
    
        });
        return deferred.promise;
    }

    $scope.getCashOut = function(id){

        var deferred = $q.defer();

        amountService.getUserCashOut(id)
        .then(function(res){
            var sum = 0;
            angular.forEach(res.data, function(val){
                sum += val.cash_out;

                // TODO - get game dates
                $scope.user.statOut.push({game_id: val.game_id, cash_out: val.cash_out ,total: sum});
            })
            
            $scope.user.totalCashOut = sum;

            deferred.resolve();
        });
        return deferred.promise;
    }

    $scope.loadData();

    $scope.edit = function(){
        $state.go('edit_account');
    }

    $scope.cancel = function(){
        $state.go('account');
    }

    $scope.save = function(isValid){

         UserService.GetByUsername($scope.user.username.toLowerCase())
        .then(function(response){
            
            if(!response.data.length || (response.data.length == 1 && $scope.user['_id'] == response.data[0]['_id'])){
                // check if paswword changed
                if($scope.password){
                    $scope.user.password = $scope.password;
                }

                // set user name to lower case before save
                $scope.user.username = $scope.user.username.toLowerCase();
        
                UserService.Update($scope.user)
                .then(function(res){
                    AuthenticationService.SetCredentials(res.data.username,res.data.password,res.data['_id'],res.data.role);
                    $rootScope.userLogIn = $cookies.getObject('globals');
                    $state.go('account');
                })
            } else {

                toastr.options = {"positionClass": "toast-top-center"};
                toastr.error('username alredy exist', 'error');
                return;

            }
        })
    }


    $scope.checkGameArray = function(game_id, player) {

        if(!$scope.user.gamesID.length) {
            return true;
        }

        var find = false;

        angular.forEach($scope.user.gamesID, function(game) {
            
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
    
    $scope.roleToShow = function(){
        var role = $scope.user.role;

        switch(role) {
            case '0': $scope.user.roleS = 'Basic'; break;
            case '1': $scope.user.roleS = 'Manager'; break;
            case '2': $scope.user.roleS = 'Admin'; break;
        }
    };

});