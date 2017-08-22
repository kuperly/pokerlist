var app = angular.module('app', ['ui.router','ngAnimate', 'toastr','ui.bootstrap'])

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
              //controllerAs: 'vm'
          })
          .state('register', {
              url: '/register',
              templateUrl: 'Templates/register.html',
              controller: 'registerController',
              //controllerAs: 'vm'
          })
        

    $urlRouterProvider.otherwise('/home');
});



