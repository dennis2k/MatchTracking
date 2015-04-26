@app = angular.module('matchtracker',['ngRoute','ngResource','ngAnimate','ui.bootstrap','angularFileUpload','toaster','LocalStorageModule'])
  .directive 'aAlert', Alert
  .directive 'enlarge', Enlarge
  .filter 'range', RangeFilter
  .filter 'games', GamesFilter
  .factory('AlertService',AlertService)
  .factory('Utility',Utility)
  .factory('AuthService',AuthServiceWrapper)
  .factory('EventService',EventServiceWrapper)
  .factory('GamesService',GamesServiceWrapper)
  .factory('WishService',WishServiceWrapper)
  .factory('UserService',UserServiceWrapper)
  .factory('BaseService',BaseServiceWrapper)
  .controller('ApplicationController',ApplicationController)
  .controller('AuthController',AuthController)
  .controller('GameGameController',GameGameController)
  .controller('GamesController',GamesController)
  .controller('UserController',UserController)
  .controller('EventController',EventController)
  .controller('CreateEventController',CreateEventController)
  .controller('NavigationController',NavigationController)
  .controller('WishListController',WishListController)
  .controller('CreateWishController',CreateWishController)
  .config(($routeProvider) ->
    $routeProvider.when('/gamegame',{templateUrl : 'views/gamegame.html',controller : 'GameGameController', controllerAs : 'vm', resolve : GameGameController.resolve})
    $routeProvider.when('/games',{templateUrl : 'views/games.html',controller : 'GamesController', controllerAs : 'vm', resolve : GamesController.resolve})
    $routeProvider.when('/events',{templateUrl : 'views/events.html',controller : 'EventController', controllerAs : 'vm', resolve : EventController.resolve})
    $routeProvider.when('/events/create',{templateUrl : 'views/createEvent.html',controller : 'CreateEventController', controllerAs : 'vm'})
    $routeProvider.when('/wishlist',{templateUrl : 'views/wishList.html',controller : 'WishListController', controllerAs : 'vm', resolve : WishListController.resolve})
    $routeProvider.when('/createWish',{templateUrl : 'views/createWish.html',controller : 'CreateWishController', controllerAs : 'vm'})
    $routeProvider.when('/users',{templateUrl : 'views/users.html',controller : 'UserController', controllerAs : 'vm', resolve : UserController.resolve})
    $routeProvider.when('/login',{templateUrl : 'views/login.html',controller : 'AuthController', controllerAs : 'vm'})
    $routeProvider.otherwise({redirectTo: '/events'})
  )
  .config((localStorageServiceProvider) ->
    localStorageServiceProvider
      .setPrefix('matchtracker')
  )
  .run(($rootScope,$location) ->
    $rootScope.edit = false
    $rootScope.initPath = $location.path()

  )