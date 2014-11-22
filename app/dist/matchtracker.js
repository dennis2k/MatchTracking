(function() {
  this.AlertController = function($scope, $timeout) {
    var vm;
    return vm = this;
  };

}).call(this);

(function() {
  this.CreateEventController = function($location, EventService) {
    var vm;
    vm = this;
    vm.event = {};
    vm.saveEvent = function(event) {
      return EventService.insert(event).then(function(result) {
        return $location.path('/events');
      });
    };
    return vm;
  };

}).call(this);

(function() {
  this.CreateWishController = function($location, WishService) {
    var vm;
    vm = this;
    vm.saveWish = function(wish) {
      return WishService.insert(wish).then(function() {
        return $location.path('/wishlist');
      });
    };
    return vm;
  };

}).call(this);

(function() {
  this.EventController = function($rootScope, $filter, EventService, GamesService, AlertService, eventList, gamesList) {
    var addMatch, addPlayer, addPlayerToMatch, getGameImage, getGames, loadEvent, numMatches, removeMatch, removePlayer, removePlayerFromMatch, vm, _ref;
    vm = this;
    vm.events = eventList.data;
    vm.games = gamesList.data;
    vm.currentEvent = {};
    vm.match = {};
    vm.root = $rootScope;
    loadEvent = function(event) {
      var params;
      console.log(event);
      params = {
        _id: event._id.$id
      };
      return EventService.query(params).then(function(result) {
        return vm.currentEvent = result.data.pop();
      });
    };
    addPlayer = function(player) {
      if (player == null) {
        return null;
      }
      vm.currentEvent.players.push(player);
      return EventService.addPlayer(vm.currentEvent._id.$id, player).then(function(result) {
        if (result.status) {
          vm.currentEvent = result.data;
        }
        return vm.player = null;
      });
    };
    removePlayer = function(player) {
      return EventService.removePlayer(vm.currentEvent._id.$id, player).then(function(result) {
        if (result.status) {
          return vm.currentEvent = result.data;
        }
      });
    };
    addPlayerToMatch = function(player) {
      var filteredArray, matchPlayer;
      if (vm.match.players == null) {
        vm.match.players = [];
      }
      filteredArray = $filter('filter')(vm.currentEvent.players, {
        name: player.name
      });
      matchPlayer = filteredArray.pop();
      matchPlayer.rank = player.rank;
      return vm.match.players.push(angular.copy(matchPlayer));
    };
    removePlayerFromMatch = function(player) {
      var idx;
      idx = vm.match.players.indexOf(player);
      return vm.match.players.splice(idx, 1);
    };
    addMatch = function(match) {
      var m;
      if (angular.isUndefined(vm.match.players) || vm.match.players.length < 2) {
        return AlertService.warning("At least two players need to participate in a match");
      }
      m = new EloCalculator(match.players);
      m.calculateNewRating();
      return EventService.addMatch(vm.currentEvent._id.$id, match).then(function(result) {
        var eventPlayer, filteredArray, player, _i, _len, _ref;
        _ref = match.players;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          console.log(player);
          filteredArray = $filter('filter')(vm.currentEvent.players, {
            name: player.name
          });
          eventPlayer = filteredArray.pop();
          eventPlayer.rating = player.new_rating;
          delete eventPlayer.rank;
        }
        EventService.updatePlayerRating(vm.currentEvent._id.$id, vm.currentEvent.players);
        vm.currentEvent.matches.push(match);
        return vm.match = {};
      });
    };
    removeMatch = function(match) {
      return EventService.removeMatch(vm.currentEvent._id.$id, match.uid).then(function(result) {
        if (result.status) {
          return vm.currentEvent = result.data;
        }
      });
    };
    getGames = function(input) {
      return GamesService.findGamesByName(input).then(function(result) {
        return result.data;
      });
    };
    getGameImage = function(game) {
      var filteredArray;
      filteredArray = $filter('filter')(vm.games, {
        _id: game
      });
      game = filteredArray.pop();
      return game.image_url || "";
    };
    numMatches = function(player) {
      var count;
      count = 0;
      angular.forEach(vm.currentEvent.matches, function(match, mindex) {
        return angular.forEach(match.players, function(p, pindex) {
          if (p.name === player.name) {
            return count++;
          }
        });
      });
      return count;
    };
    vm.addPlayerToMatch = addPlayerToMatch;
    vm.removePlayerFromMatch = removePlayerFromMatch;
    vm.loadEvent = loadEvent;
    vm.addPlayer = addPlayer;
    vm.removePlayer = removePlayer;
    vm.addMatch = addMatch;
    vm.removeMatch = removeMatch;
    vm.getGames = getGames;
    vm.getGameImage = getGameImage;
    vm.numMatches = numMatches;
    vm.canEdit = (_ref = $rootScope.edit) != null ? _ref : {
      "true": false
    };
    return vm;
  };

  EventController.resolve = {
    eventList: function(EventService) {
      return EventService.query();
    },
    gamesList: function(GamesService) {
      return GamesService.query();
    }
  };

}).call(this);

(function() {
  this.GameGameController = function($interval, gamesList) {
    var play, selectGame, timer, vm;
    vm = this;
    vm.games = gamesList.data;
    vm.selectedGames = [];
    vm.playing = false;
    timer = null;
    selectGame = function(game) {
      return vm.selectedGames.push(game);
    };
    play = function() {
      vm.playing = true;
      return timer = $interval(function() {
        var index;
        if (vm.selectedGames.length === 1) {
          return $interval.cancel(timer);
        }
        index = Math.floor(Math.random() * vm.selectedGames.length);
        console.log(index);
        return vm.selectedGames.splice(index, 1);
      }, 2000);
    };
    vm.selectGame = selectGame;
    vm.play = play;
    return vm;
  };

  GameGameController.resolve = {
    gamesList: function(GamesService) {
      return GamesService.query();
    }
  };

}).call(this);

(function() {
  this.GamesController = function($filter, GamesService, gameList) {
    var removeGame, saveGame, uploadFile, vm;
    vm = this;
    vm.games = gameList.data;
    vm.newGame = {};
    saveGame = function(game) {
      return GamesService.insert(game).then(function(result) {
        if (result.status) {
          return vm.games.push(result.data);
        }
      });
    };
    removeGame = function(game) {
      return GamesService["delete"](game._id).then(function() {
        var idx;
        idx = vm.games.indexOf(game);
        return vm.games.splice(idx, 1);
      });
    };
    uploadFile = function(files) {
      return GamesService.upload(files).then(function(result) {
        console.log(result.data);
        return vm.newGame.image_url = result.data.data;
      });
    };
    vm.saveGame = saveGame;
    vm.removeGame = removeGame;
    vm.uploadFile = uploadFile;
    return vm;
  };

  GamesController.resolve = {
    gameList: function(GamesService) {
      return GamesService.query();
    }
  };

}).call(this);

(function() {
  this.NavigationController = function($rootScope, $location, EventService) {
    var nav;
    nav = this;
    nav.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
    nav.cheat = function(code) {
      return EventService.cheat(code).then(function(result) {
        if (result.status) {
          $rootScope.edit = true;
        }
        return nav.code = "";
      });
    };
    return nav;
  };

}).call(this);

(function() {
  this.WishListController = function($sce, wishList, WishService, TestService) {
    var vm;
    vm = this;
    vm.wishes = wishList.data;
    console.log(TestService);
    TestService.query();
    vm.trustAsUrl = function(url) {
      return $sce.trustAsResourceUrl(url);
    };
    vm.removeWish = function(wish) {
      return WishService["delete"](wish._id).then(function() {
        var idx;
        idx = vm.wishes.indexOf(wish);
        return vm.wishes.splice(idx, 1);
      });
    };
    return vm;
  };

  WishListController.resolve = {
    wishList: function(WishService) {
      return WishService.query();
    }
  };

}).call(this);
;(function() {
  this.AlertService = function($rootScope) {
    var alert, error, info, send, service, warning;
    service = {};
    alert = function(prefix, type, message) {
      return send(prefix(type(message)));
    };
    error = function(message) {
      return send('Error', 'alert-danger', message);
    };
    info = function(message) {
      return send('Info', 'alert-info', message);
    };
    warning = function(message) {
      return send('Warning', 'alert-warning', message);
    };
    send = function(prefix, type, message) {
      return $rootScope.$broadcast('alert', {
        prefix: prefix,
        "class": type,
        message: message
      });
    };
    service.error = error;
    service.info = info;
    service.warning = warning;
    service.alert = alert;
    return service;
  };

  AlertService.$inject = ['$rootScope'];

}).call(this);

(function() {
  this.BaseServiceWrapper = function($http, $q, $upload) {
    return this.BaseService = (function() {
      var request;

      function BaseService(route) {
        this.route = route;
      }

      request = function(method, url, params) {
        var deferred;
        if (angular.isUndefined(params)) {
          params = {};
        }
        deferred = $q.defer();
        $http({
          url: 'service.php/' + url,
          method: method,
          params: params
        }).success(function(response) {
          deferred.resolve(response);
          if (!!response.message) {
            return response.status && AlertService.info(response.message) || AlertService.error(response.message);
          }
        }).error(function(response) {
          deferred.reject(response);
          return AlertService.error(response.message);
        });
        return deferred.promise;
      };

      BaseService.prototype.query = function(params) {
        return request('get', this.route + "/query", params);
      };

      BaseService.prototype.insert = function(params) {
        return request('post', this.route + "/create", params);
      };

      BaseService.prototype.update = function(params) {
        return request('post', this.route + "/update", params);
      };

      BaseService.prototype["delete"] = function(id) {
        return request('post', this.route + "/remove", {
          id: id
        });
      };

      BaseService.prototype.upload = function(files) {
        var deferred;
        deferred = $q.defer();
        return $upload.upload({
          url: 'service.php/games/upload',
          method: 'post',
          file: files[0]
        }).success(function(response) {
          deferred.resolve(response.data);
          if (!!response.message) {
            return response.status && AlertService.info(response.message) || AlertService.error(response.message);
          }
        }).error(function(response) {
          return deferred.reject(response.data);
        });
      };

      return BaseService;

    })();
  };

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.EventServiceWrapper = function(BaseService, Utility) {
    var EventService;
    EventService = (function(_super) {
      __extends(EventService, _super);

      function EventService() {
        return EventService.__super__.constructor.apply(this, arguments);
      }

      EventService.prototype.addMatch = function(id, match) {
        match.uid = Utility.guid();
        match.timestamp = new Date().getTime() + "";
        return this.update({
          _id: id,
          doc: {
            $push: {
              matches: match
            }
          }
        });
      };

      EventService.prototype.removeMatch = function(id, uid) {
        return this.update({
          _id: id,
          doc: {
            $pull: {
              matches: {
                uid: uid
              }
            }
          }
        });
      };

      EventService.prototype.addPlayer = function(id, player) {
        return this.update({
          _id: id,
          doc: {
            $addToSet: {
              players: {
                name: player,
                rating: 1000
              }
            }
          }
        });
      };

      EventService.prototype.removePlayer = function(id, player) {
        return this.update({
          _id: id,
          doc: {
            $pull: {
              players: {
                name: player.name
              }
            }
          }
        });
      };

      EventService.prototype.updatePlayerRating = function(id, players) {
        return this.update({
          _id: id,
          doc: {
            $set: {
              players: players
            }
          }
        });
      };

      EventService.prototype.cheat = function(code) {
        this.route = 'cheat';
        return this.query({
          code: code
        });
      };

      return EventService;

    })(BaseService);
    return new EventService('events');
  };

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.GamesServiceWrapper = function(BaseService) {
    var GamesService;
    GamesService = (function(_super) {
      __extends(GamesService, _super);

      function GamesService() {
        return GamesService.__super__.constructor.apply(this, arguments);
      }

      GamesService.prototype.findGamesByName = function(name) {
        return this.query({
          doc: {
            _id: name
          }
        });
      };

      return GamesService;

    })(BaseService);
    return new GamesService('games');
  };

}).call(this);

(function() {
  this.Utility = function() {
    var guid, service;
    service = {};
    guid = function() {
      var _p8;
      _p8 = function(s) {
        var p;
        p = (Math.random().toString(16) + "000000000").substr(2, 8);
        if (s) {
          "-" + p.substr(0, 4) + "-" + p.substr(4, 4);
        }
        if (!s) {
          return p;
        }
      };
      return _p8() + _p8(true) + _p8(true) + _p8();
    };
    service.guid = guid;
    return service;
  };

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.WishServiceWrapper = function(BaseService) {
    var WishService;
    WishService = (function(_super) {
      __extends(WishService, _super);

      function WishService() {
        return WishService.__super__.constructor.apply(this, arguments);
      }

      return WishService;

    })(BaseService);
    return new WishService('wishe');
  };

}).call(this);
;(function() {
  this.BaseService = (function() {
    BaseService.prototype.name = null;

    BaseService.prototype.wrapper = null;

    function BaseService(name, wrapper) {
      this.name = name;
      this.wrapper = wrapper;
    }

    BaseService.prototype.query = function(params) {
      return this.wrapper.get(service.name + "/query", params);
    };

    BaseService.prototype.create = function(params) {
      return this.wrapper.post(service.name + "/create", params);
    };

    BaseService.prototype.update = function(params) {
      return this.wrapper.post(service.name + "/update", params);
    };

    BaseService.prototype["delete"] = function(id) {
      return this.wrapper.post(service.name + "/remove", {
        id: id
      });
    };

    return BaseService;

  })();

}).call(this);

(function() {
  this.EloCalculator = (function() {
    EloCalculator.prototype.defaultRating = 1000;

    EloCalculator.prototype.k = 15;

    EloCalculator.prototype.players = {};

    function EloCalculator(players) {
      this.players = players;
    }

    EloCalculator.prototype.getKValue = function(player) {
      return 15;
    };

    EloCalculator.prototype.getActualScore = function(player, opp) {
      if (player.rank < opp.rank) {
        return 1;
      }
      if (player.rank === opp.rank) {
        return 0.5;
      }
      if (player.rank > opp.rank) {
        return 0;
      }
    };

    EloCalculator.prototype.getExpectedScore = function(player, opp) {
      var diff, ea, exp;
      diff = opp.rating - player.rating;
      exp = diff / 400;
      ea = 1 / (1 + Math.pow(10, exp));
      console.log("EA for player: " + player.name + " vs opponent " + opp.name + " = " + ea);
      return ea;
    };

    EloCalculator.prototype.calculateNewRating = function() {
      var opp, player, subMatch, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        subMatch = 0;
        _ref1 = this.players;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          opp = _ref1[_j];
          if (player.name !== opp.name) {
            subMatch += this.getKValue(player) * (this.getActualScore(player, opp) - this.getExpectedScore(player, opp));
            console.log("Current submatch for player " + player.name);
          }
        }
        console.log("Adjustment for player: " + player.name + " -  " + subMatch);
        player.new_rating = Math.round((player.rating + subMatch) * 100) / 100;
        player.adjustment = Math.round(subMatch * 100) / 100;
      }
      return this.player;
    };

    return EloCalculator;

  })();

}).call(this);
;(function() {
  this.Alert = function($timeout) {
    var directive;
    directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = function(ele, attrs) {
      return attrs.templateUrl || 'templates/alert.tpl.html';
    };
    directive.link = function(scope, element, attrs) {
      var show;
      scope.alert = {
        "class": '',
        message: '',
        show: false
      };
      scope.timer = null;
      scope.delay = 10000;
      show = function() {
        scope.alert.show = true;
        $timeout.cancel(scope.timer);
        return scope.timer = $timeout(function() {
          return scope.alert.show = false;
        }, scope.delay);
      };
      scope.$on('alert', function(event, data) {
        scope.alert = data;
        return show();
      });
      return scope.remove = function() {
        return scope.alert = {
          "class": '',
          show: false,
          message: ''
        };
      };
    };
    return directive;
  };

}).call(this);

(function() {
  this.Enlarge = function() {
    var directive;
    directive = {};
    directive.restrict = 'A';
    directive.link = function(scope, element, attrs) {
      var originalHeight, originalWidth;
      originalHeight = element.css('height');
      originalWidth = element.css('width');
      element.on('mouseenter', function() {
        return element.css('width', '100px').css('height', '100px');
      });
      return element.on('mouseleave', function() {
        return element.css('width', originalWidth).css('height', originalHeight);
      });
    };
    return directive;
  };

}).call(this);

(function() {
  this.HistoryBack = function($window) {
    var directive;
    directive = {};
    directive.restrict = 'AE';
    directive.link = function(scope, element, attr) {
      return element.on('click', function() {
        return $window.history.back();
      });
    };
    return directive;
  };

}).call(this);
;(function() {
  this.RangeFilter = function() {
    var filter;
    filter = function(input, max) {
      var i, _i;
      max = parseInt(max);
      for (i = _i = 1; _i <= max; i = _i += 1) {
        input.push(i);
      }
      return input;
    };
    return filter;
  };

}).call(this);
;(function() {
  this.app = angular.module('matchtracker', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'angularFileUpload']).directive('aAlert', Alert).directive('enlarge', Enlarge).filter('range', RangeFilter).factory('AlertService', AlertService).factory('Utility', Utility).factory('EventService', EventServiceWrapper).factory('GamesService', GamesServiceWrapper).factory('WishService', WishServiceWrapper).factory('BaseService', BaseServiceWrapper).controller('GameGameController', GameGameController).controller('GamesController', GamesController).controller('EventController', EventController).controller('CreateEventController', CreateEventController).controller('NavigationController', NavigationController).controller('WishListController', WishListController).controller('CreateWishController', CreateWishController).config(function($routeProvider) {
    $routeProvider.when('/gamegame', {
      templateUrl: 'views/gamegame.html',
      controller: 'GameGameController',
      controllerAs: 'vm',
      resolve: GameGameController.resolve
    });
    $routeProvider.when('/games', {
      templateUrl: 'views/games.html',
      controller: 'GamesController',
      controllerAs: 'vm',
      resolve: GamesController.resolve
    });
    $routeProvider.when('/events', {
      templateUrl: 'views/events.html',
      controller: 'EventController',
      controllerAs: 'vm',
      resolve: EventController.resolve
    });
    $routeProvider.when('/events/create', {
      templateUrl: 'views/createEvent.html',
      controller: 'CreateEventController',
      controllerAs: 'vm'
    });
    $routeProvider.when('/wishlist', {
      templateUrl: 'views/wishList.html',
      controller: 'WishListController',
      controllerAs: 'vm',
      resolve: WishListController.resolve
    });
    $routeProvider.when('/createWish', {
      templateUrl: 'views/createWish.html',
      controller: 'CreateWishController',
      controllerAs: 'vm'
    });
    return $routeProvider.otherwise({
      redirectTo: '/events'
    });
  }).run(function($rootScope) {
    return $rootScope.edit = false;
  });

}).call(this);
