var app = angular.module('app', ['ui.router','ngAnimate', 'toastr','ui.bootstrap','ngCookies'])
.controller('mainController',function($state,$scope,$rootScope,$cookies,AuthenticationService,toastr){
    $rootScope.userLogIn = $cookies.getObject('globals');
    $scope.logout = function(){
        AuthenticationService.ClearCredentials();
        $rootScope.userLogIn = {};
        toastr.options = {"positionClass": "toast-top-center"};
        toastr.info('Logged out', 'info');
        $state.go('home');
    };
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
          .state('home', {
              url: '/home',
              templateUrl: 'Templates/home.html'
              //controller: 'Ctrl'
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
        

    $urlRouterProvider.otherwise('/home');
});

run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }



