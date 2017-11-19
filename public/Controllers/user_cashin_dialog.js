app.controller('userCashinDialog', function($scope,amountService,ngDialog) {
    
    var user = $scope.ngDialogData.user;
    $scope.fullName = user.fullName;
    var game = $scope.ngDialogData.gameID;
    
    amountService.getUserCashInByGame(game,user.id).then (function(res) {
        
        $scope.userCash = res.data;

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
                $scope.userCash.splice(index,1);

                if(!$scope.userCash.length) {
                    ngDialog.closeAll();
                }

            }
            
        });

    }
    
  });