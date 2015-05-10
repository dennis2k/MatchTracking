@app = angular.module('matchtracker',['ngRoute','ngResource','ngAnimate','ui.bootstrap','toaster','LocalStorageModule','ngFileUpload'])
  .directive 'back', HistoryBack
  .filter 'range', RangeFilter
  .filter 'games', GamesFilter
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
  .controller('EventListController',EventListController)
  .controller('CreateEventController',CreateEventController)
  .controller('NavigationController',NavigationController)
  .controller('WishListController',WishListController)
  .controller('CreateWishController',CreateWishController)
  .controller('ProfileController',ProfileController)
  .config(($routeProvider) ->
        $routeProvider.when('/gamegame',{templateUrl : 'src/modules/games/gamegame.html',controller : 'GameGameController', controllerAs : 'vm', resolve : GameGameController.resolve})
        $routeProvider.when('/games',{templateUrl : 'src/modules/games/games.html',controller : 'GamesController', controllerAs : 'vm', resolve : GamesController.resolve})
        $routeProvider.when('/events',{templateUrl : 'src/modules/events/eventList.html',controller : 'EventListController', controllerAs : 'vm', resolve : EventListController.resolve})

        $routeProvider.when('/event/:name',
                            {
                              templateUrl : 'src/modules/events/event.html',
                              controller : 'EventController',
                              controllerAs : 'vm',
                              resolve : EventController.resolve})
        $routeProvider.when('/events/create',{templateUrl : 'src/modules/events/createEvent.html',controller : 'CreateEventController', controllerAs : 'vm', resolve : CreateEventController.resolve})
        $routeProvider.when('/wishlist',{templateUrl : 'src/modules/wishes/wishList.html',controller : 'WishListController', controllerAs : 'vm', resolve : WishListController.resolve})
        $routeProvider.when('/createWish',{templateUrl : 'src/modules/wishes/createWish.html',controller : 'CreateWishController', controllerAs : 'vm'})
        $routeProvider.when('/users',{templateUrl : 'src/modules/users/users.html',controller : 'UserController', controllerAs : 'vm', requireAdmin : true, resolve : UserController.resolve})
        $routeProvider.when('/login',{templateUrl : 'src/modules/auth/login.html',controller : 'AuthController', controllerAs : 'vm'})
        $routeProvider.when('/profile',{templateUrl : 'src/modules/users/profile.html',controller : 'ProfileController', controllerAs : 'vm'})
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


