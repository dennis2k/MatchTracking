@app = angular.module('matchtracker',['ngRoute','ngResource','ngAnimate','ui.bootstrap','angularFileUpload','toaster'])
  .directive 'aAlert', Alert
  .directive 'enlarge', Enlarge
  .filter 'range', RangeFilter
  .filter 'games', GamesFilter
  .factory('AlertService',AlertService)
  .factory('Utility',Utility)
  .factory('EventService',EventServiceWrapper)
  .factory('GamesService',GamesServiceWrapper)
  .factory('WishService',WishServiceWrapper)
  .factory('BaseService',BaseServiceWrapper)
  .controller('GameGameController',GameGameController)
  .controller('GamesController',GamesController)
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
    $routeProvider.otherwise({redirectTo: '/events'})
  )
  .run(($rootScope) ->
    $rootScope.edit = false
  )