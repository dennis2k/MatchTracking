@app = angular.module('matchtracker',['ngRoute','ngResource','ngAnimate','ui.bootstrap','angularFileUpload'])
  .directive 'aAlert', Alert
  .directive 'enlarge', Enlarge
  .filter 'range', RangeFilter
  .factory('AlertService',AlertService)
  .factory('Utility',Utility)
  .factory('HttpWrapper',HttpWrapper)
  .factory('CommonService',CommonService)
  .factory('EventService',EventService)
  .factory('GamesService',GamesService)
  .controller('GameGameController',GameGameController)
  .controller('GamesController',GamesController)
  .controller('EventController',EventController)
  .controller('CreateEventController',CreateEventController)
  .controller('NavigationController',NavigationController)
  .config(($routeProvider) ->
    $routeProvider.when('/gamegame',{templateUrl : 'views/gamegame.html',controller : 'GameGameController', controllerAs : 'vm', resolve : GameGameController.resolve})
    $routeProvider.when('/games',{templateUrl : 'views/games.html',controller : 'GamesController', controllerAs : 'vm', resolve : GamesController.resolve})
    $routeProvider.when('/events',{templateUrl : 'views/events.html',controller : 'EventController', controllerAs : 'vm', resolve : EventController.resolve})
    $routeProvider.when('/events/create',{templateUrl : 'views/createEvent.html',controller : 'CreateEventController', controllerAs : 'vm'})
    $routeProvider.otherwise({redirectTo: '/'})
  )
  .run(($rootScope) ->
    $rootScope.edit = false
  )