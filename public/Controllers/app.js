var app = angular.module('app', ['ui.router','ngAnimate', 'toastr','ui.bootstrap','ngCookies','ngMessages','angularjs-dropdown-multiselect','vsGoogleAutocomplete','angular-scroll-animate','countTo','ngDialog','chart.js'])
.controller('mainController',function($state,$scope,$rootScope,$cookies,AuthenticationService,toastr,groupService){
    $rootScope.userLogIn = $cookies.getObject('globals');

    // $rootScope.selectedGroupID = selectedGroupID;

    $scope.logout = function() {
        AuthenticationService.ClearCredentials();
        $rootScope.userLogIn = {};
        toastr.options = {"positionClass": "toast-top-center"};
        toastr.info('Logged out', 'info');
        $state.go('home');
    };

    groupService.getAllGroups()
    .then(function(res){
        
        $scope.groups = res.data;

        if($scope.groups.length){
            $scope.selectedGroupID = $scope.groups[0]['_id'];
        } else {
            $scope.selectedGroupID = "Select group";
        }
        
       
    });
    
})

.config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $stateProvider
        //   .state('home', {
        //       url: '/',
        //       templateUrl: 'Templates/home.html'
        //       //controller: 'Ctrl'
        //   })
            .state('home', {
              url: '/',
              templateUrl: 'Templates/newHome.html',
              controller: 'homeController'
          })
            .state('groups', {
              url: '/groups',
              templateUrl: 'Templates/groups.html'
              //controller: 'accountController'
              //controllerAs: 'vm'
          })
            .state('games', {
                url: '/games',
                templateUrl: 'Templates/games.html'
                //controller: 'gamesController'
                //controllerAs: 'vm'
            })
            .state('new_game', {
                url: '/new_game',
                templateUrl: 'Templates/new_game.html'
                //controller: 'newGameController',
                //controllerAs: 'vm'
            })
            .state('game_details', {
                url: '/game_details/:id',
                templateUrl: 'Templates/game_details.html'
                //controller: 'newGameController',
                //controllerAs: 'vm'
            })
            .state('edit_game', {
                url: '/edit_game/:id',
                templateUrl: 'Templates/edit_game.html'
                //controller: 'newGameController',
                //controllerAs: 'vm'
            })
          .state('balance', {
              url: '/balance',
              templateUrl: 'Templates/balance.html'
              //controller: 'balanceController',
              //controllerAs: 'vm'
          })
          .state('login', {
              url: '/login',
              templateUrl: 'Templates/login.html',
              controller: 'LoginController',
              controllerAs: 'vm'
          })
          .state('register', {
              url: '/register',
              templateUrl: 'Templates/register.html',
              controller: 'RegisterController',
              controllerAs: 'vm'
          })
         .state('account', {
              url: '/account',
              templateUrl: 'Templates/account.html'
              //controller: 'accountController'
              //controllerAs: 'vm'
          })
          .state('edit_account', {
              url: '/edit_account',
              templateUrl: 'Templates/edit_account.html'
              //controller: 'accountController'
              //controllerAs: 'vm'
          })
          .state('manage_users', {
              url: '/manage_users',
              templateUrl: 'Templates/manage_users.html'
              //controller: 'accountController'
              //controllerAs: 'vm'
          })
        

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true).hashPrefix('!')
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('');
});

app.run(function ($rootScope, $cookies,$location,$state) {

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var user = $cookies.getObject('globals');
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register',]) === -1;
        var isHome = $location.path() === "" || $location.path() === "/";
        var loggedIn = $cookies.getObject('globals');
            if (restrictedPage && !isHome && !loggedIn) {
                event.preventDefault();
                $state.go('login');
            }
    });

// Safely instantiate dataLayer
var dataLayer = window.dataLayer = window.dataLayer || [];

$rootScope.$on('$stateChangeSuccess', function() {

        var userId = undefined;
        if($cookies.getObject('globals')){
            userId = $cookies.getObject('globals').currentUser.id;
        }
    
          dataLayer.push({
            event: 'ngRouteChange',
            attributes: {
              route: $location.path(),
              dl_uid: userId
            }
          });
    
        });

});

