app.controller('groupsController', function ($scope,gamesService,playerService,amountService, $q,toastr,$state,$rootScope,$filter,$log, $mdDialog, groupService,coutryService) {
    
    console.log("groupsController start");

    var vm = this;

    // Table - sort & filter
    vm.sortType     = ['balance','totalCashOut','totalCashIn']; // set the default sort type
    vm.sortReverse  = true;  // set the default sort order
    vm.searchAtTable   = '';     // set the default 


    //vm.users = [];
    vm.groups = [];
    //vm.cashIn = [];

    //test
    groupService.getUsersByGroupId('598b8420f36d285bd4912b34').then(function(res){
        console.log("user by id:",res);
    })

    groupService.getAllGroups()
    .then(function(res){
        vm.groups = res.data;
        // angular.forEach(vm.groups.days,function(day){
        //     vm.groups.daysToShow += day + " ";
        // });

        

        for(var i=0 ; i< vm.groups.length ; i++){
            if(vm.groups[i].days){
                if(vm.groups[i].days.length == 7){
                    vm.groups[i].daysToShow = "All day";
                } else {
                    vm.groups[i].daysToShow = "";
                    for(var j=0 ; j< vm.groups[i].days.length ; j++){
                        vm.groups[i].daysToShow += vm.groups[i].days[j] + " ";
                    }
                }
            }
        }
    });

    vm.goToGroup = function(groupID) {
        $state.go('games',{group_id: groupID});
    }



    // autocomplete

    vm.selectedItem = '';
    vm.searchText = '';

    vm.querySearch   = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange   = searchTextChange;
    
    
    

    // function findCountry (query) {
    //   var results = $filter('filter')(vm.allCountries,query);
    //     return results;
    // }

    function querySearch (query) {
    //   var results = query ? vm.groups.filter( createFilterFor(query) ) : vm.groups, deferred;
      var results = $filter('filter')(vm.groups,query);
        return results;
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    // Dialog
    vm.showAdvanced = function(ev) {
        if(vm.searchText){
            vm.searchText = "";
        }
        $mdDialog.show({
            templateUrl: 'Templates/dialog_tmpl.html',
            controller: DialogController,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(answer) {
            $state.reload();
        });
  };

  function DialogController($rootScope,$scope, $mdDialog,groupService,coutryService,$q) {
    
    $scope.user = {};

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.newGroup = function(group) {
        
        group.admin_name = $rootScope.userLogIn.currentUser.username;
        group.admin_id = $rootScope.userLogIn.currentUser.id;
        console.log(group);

        group.country = group.city.split(',')[1].trim();
        group.city = group.city.split(',')[0];

        console.log(group.country + " " + group.city);

        groupService.postNewGroup(group).then(function(res){
            $mdDialog.hide(res);
        });
        
    };

    $scope.allCountries = coutryService.getCountries();

    $scope.findCountry = function(query) {
        var results = $filter('filter')($scope.allCountries,query);
        console.log(results);
        return results;
    };

    $scope.selectedCountryChange = function (item) {
      $scope.user.country = item.name;
      
    }

    
    $scope.findCity = function (serch) {

        var Promise = $q.defer();

        coutryService.getCities(serch,$scope.selectedCounty.alpha_2)
        .then(function(res){
            // coutryService.getCities(name,id).then(function(res){
            // $scope.city = res.data.predictions[0].terms[0].value;
            // console.log(res.data.predictions);
            Promise.resolve(res.data.predictions);
        });
        return Promise.promise;
    };


    $scope.selectedCityChange = function (item) {
      $scope.user.city = item.terms[0].value;
    }


    // multi select
    $scope.user.days = []; 
    $scope.example1data = [ "Sunday", "Monday", "Tuesday" , "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.settings = {
        scrollable:true,
        styleActive:true,
        // smartButtonTextProvider(selectionArray) { return selectionArray },
        scrollableHeight:100,
        buttonClasses: 'btn btn-primary',
        displayProp:'name',
        template: '{{option}}',
        smartButtonTextConverter(skip, option) {
             return option; 
            }
    }  

  }
  
});



