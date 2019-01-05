app.controller('userCashinDialog', function($scope,amountService,ngDialog) {
    
    var user = $scope.ngDialogData.user;
    $scope.fullName = user.fullName;
    var game = $scope.ngDialogData.gameID;
    
    amountService.getUserCashInAndOutByGame(game,user.id).then (function(res) {
        
        if(res.data) {
            $scope.userCashIn = res.data.cachIn;
            $scope.userCashOut = res.data.cachOut;
        }

    });

    $scope.daleteCashIn = function (id,index) {

        amountService.deleteUserCashIn (id).then(function(res){

            if(res.status == 200){

                $scope.$parent.players[$scope.players.indexOf(user)].cashIn -= res.data.cash_in;
                $scope.$parent.totalCashIn -= res.data.cash_in;
                $scope.$parent.balance -= res.data.cash_in;
                if($scope.$parent.players[$scope.players.indexOf(user)].total){
                    $scope.$parent.players[$scope.players.indexOf(user)].total += res.data.cash_in;
                }
                $scope.userCashIn.splice(index,1);

                if(needCloseDialog()) {
                    ngDialog.closeAll();
                }

            }
            
        });

    }

    $scope.daleteCashOut = function (id,index) {

        amountService.deleteUserCashOut (id).then(function(res){

            if(res.status == 200){

                $scope.$parent.players[$scope.players.indexOf(user)].cashOut -= res.data.cash_out;
                //$scope.$parent.totalCashOut += res.data.cash_out;
                $scope.$parent.balance += res.data.cash_out;
                if($scope.$parent.players[$scope.players.indexOf(user)].total){
                    $scope.$parent.players[$scope.players.indexOf(user)].total -= res.data.cash_out;
                }
                $scope.userCashOut.splice(index,1);

                if(needCloseDialog()) {
                    ngDialog.closeAll();
                }

            }
            
        });

    }

    function needCloseDialog() {
        return !$scope.userCashOut.length && !$scope.userCashIn.length
    }
    
  });