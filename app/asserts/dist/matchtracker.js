this.ApplicationController = function($rootScope, AuthService, $location, localStorageService, toaster) {
  var vm;
  vm = this;
  $rootScope.authenticated = null;
  $rootScope.$on('authenticated', function(event, data) {
    $rootScope.authenticated = true;
    $rootScope.user = data;
    if (angular.isDefined($rootScope.initPath) && $rootScope.initPath !== '/login') {
      return $location.path($rootScope.initPath);
    } else {
      return $location.path('/events');
    }
  });
  $rootScope.$on('unauthorized', function() {
    $rootScope.authenticated = false;
    return $location.path('/login');
  });
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if (next.requireAdmin === true) {
      if (angular.isUndefined($rootScope.user) || $rootScope.user.admin !== true) {
        toaster.pop('warning', 'Restricted', 'Upps admins only sir !');
        console.log(current);
        $location.path(current.$$route.originalPath);
      }
    }
    if ($rootScope.authenticated === false || $rootScope.authenticated === null) {
      return $location.path('/login');
    }
  });
  AuthService.isAuthenticated();
  vm.logout = function() {
    localStorageService.clearAll();
    $rootScope.authenticated = false;
    return $location.path('/login');
  };
  return vm;
};

this.BaseServiceWrapper = function($http, $q, toaster) {
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
        if (response.status && !!response.message) {
          toaster.pop("success", "Info!", response.message);
        }
        if (response.status === false) {
          toaster.pop("error", "Error!", response.message);
        }
        return deferred.resolve(response);
      }).error(function(response) {
        toaster.pop("error", "Error!", response.message);
        return deferred.reject(response);
      });
      return deferred.promise;
    };

    BaseService.prototype.getById = function(id) {
      return this.query({
        doc: {
          _id: id
        }
      });
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
        _id: id
      });
    };

    return BaseService;

  })();
};

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

this.RangeFilter = function() {
  var filter;
  filter = function(input, max) {
    var i, j, ref;
    max = parseInt(max);
    for (i = j = 1, ref = max; j <= ref; i = j += 1) {
      input.push(i);
    }
    return input;
  };
  return filter;
};

this.Utility = function(Upload) {
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
  service.upload = function(file, context) {
    return Upload.upload({
      url: 'service.php/upload/' + context,
      fields: {
        context: context
      },
      file: file
    });
  };
  return service;
};

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

this.AuthController = function(AuthService, UserService) {
  var vm;
  vm = this;
  vm.authenticate = function(creds) {
    return AuthService.authenticate(creds._id, creds.password);
  };
  vm.register = function(user) {
    return UserService.insert(user).then(function(result) {
      if (result.status === true) {
        return vm.authenticate(user);
      }
    });
  };
  return vm;
};

this.AuthServiceWrapper = function(localStorageService, $http, $q, $rootScope, $location, toaster) {
  var AuthService;
  AuthService = (function() {
    function AuthService() {}

    AuthService.prototype.authenticate = function(username, password) {
      var deferred;
      deferred = $q.defer();
      $http({
        url: 'service.php/auth/login',
        method: 'POST',
        params: {
          _id: username,
          password: password
        }
      }).then(function(response) {
        deferred.resolve(response);
        if (response.data.status === true) {
          localStorageService.set('user', username);
          localStorageService.set('token', response.data.data.token);
          $rootScope.$broadcast('authenticated', response.data.data);
          return toaster.pop('info', 'Info', 'Welcaaaam sir ' + username);
        } else {
          toaster.pop('error', 'Error!', 'Wrong username or password');
          return $rootScope.$broadcast('unauthorized');
        }
      }, function(response) {
        return deferred.reject(response);
      });
      return deferred.promise;
    };

    AuthService.prototype.isAuthenticated = function() {
      var deferred, token, user;
      token = localStorageService.get('token');
      user = localStorageService.get('user');
      deferred = $q.defer();
      $http({
        url: 'service.php/auth',
        method: 'GET',
        params: {
          token: token,
          user: user
        }
      }).then(function(response) {
        deferred.resolve(response);
        if (response.data.status === true) {
          return $rootScope.$broadcast('authenticated', response.data.data);
        } else {
          return $rootScope.$broadcast('unauthorized');
        }
      }, function(response) {
        deferred.reject(response);
        return $rootScope.$broadcast('unauthorized');
      });
      return deferred.promise;
    };

    return AuthService;

  })();
  return new AuthService;
};

this.CreateEventController = function($location, $filter, $scope, EventService, userList, $rootScope, Utility) {
  var convertDateToTime, vm;
  vm = this;
  vm.users = userList.data;
  vm.event = {};
  vm.files = [];
  vm.saveEvent = function(event) {
    var eventPlayers, i, len, player, ref;
    eventPlayers = [];
    ref = vm.users;
    for (i = 0, len = ref.length; i < len; i++) {
      player = ref[i];
      if (player.include === true) {
        eventPlayers.push({
          name: player._id,
          rating: 1000
        });
      }
    }
    event.players = eventPlayers;
    event.owner = $rootScope.user._id;
    event.start = convertDateToTime(event.start);
    event.end = convertDateToTime(event.end);
    return EventService.insert({
      event: event
    }).then(function(result) {
      return $location.path('/events');
    });
  };
  $scope.$watch('vm.files', function(n, o) {
    if (n !== o && n !== null && angular.isDefined(n)) {
      return vm.upload(vm.files);
    }
  });
  vm.upload = function(files) {
    if (files && files.length) {
      return angular.forEach(files, function(file) {
        return Utility.upload(file, 'game').then(function(response) {
          return vm.event.image_url = response.data.data;
        });
      });
    }
  };
  convertDateToTime = function(date) {
    var d;
    d = new Date(date);
    return d.getTime();
  };
  vm.openDatePicker = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    return vm.opened = true;
  };
  return vm;
};

CreateEventController.resolve = {
  userList: function(UserService) {
    return UserService.query();
  }
};

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
    var i, j, len, len1, opp, player, ref, ref1, subMatch;
    ref = this.players;
    for (i = 0, len = ref.length; i < len; i++) {
      player = ref[i];
      subMatch = 0;
      ref1 = this.players;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        opp = ref1[j];
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

this.EventController = function(event, $rootScope, $filter, $scope, $location, toaster, EventService, GamesService, eventList, gamesList, userList, Utility) {
  var vm;
  vm = this;
  vm.games = gamesList.data;
  vm.users = userList.data;
  vm.currentEvent = event.data[0];
  vm.match = {
    players: vm.currentEvent.players
  };
  vm.root = $rootScope;
  vm.selectEvent = function(event) {
    return $location.path('/event/' + event.name);
  };
  vm.addPlayer = function(player) {
    if (player == null) {
      return null;
    }
    vm.currentEvent.players.push(player);
    return EventService.addPlayer(vm.currentEvent._id.$id, player._id).then(function(result) {
      if (result.status) {
        vm.currentEvent = result.data;
      }
      return vm.player = null;
    });
  };
  vm.removePlayer = function(player) {
    return EventService.removePlayer(vm.currentEvent._id.$id, player).then(function(result) {
      if (result.status) {
        return vm.currentEvent = result.data;
      }
    });
  };
  vm.addPlayerToMatch = function(player) {
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
  vm.removePlayerFromMatch = function(player) {
    var idx;
    idx = vm.match.players.indexOf(player);
    return vm.match.players.splice(idx, 1);
  };
  vm.addMatch = function(match) {
    var filteredPlayers, m;
    filteredPlayers = $filter('filter')(match.players, function(player) {
      if (player.rank === '') {
        return false;
      }
      if (player.is_not_participating) {
        return false;
      }
      return true;
    });
    if (filteredPlayers.length === 0) {
      toaster.pop('warning', "Warning!", "No players selected for match");
    }
    match.players = filteredPlayers;
    m = new EloCalculator(match.players);
    m.calculateNewRating();
    return EventService.addMatch(vm.currentEvent._id.$id, match).then(function(result) {
      var eventPlayer, filteredArray, i, len, player, ref;
      ref = match.players;
      for (i = 0, len = ref.length; i < len; i++) {
        player = ref[i];
        filteredArray = $filter('filter')(vm.currentEvent.players, {
          name: player.name
        });
        eventPlayer = filteredArray.pop();
        eventPlayer.rating = player.new_rating;
        delete eventPlayer.rank;
        delete eventPlayer.is_not_participating;
      }
      EventService.updatePlayerRating(vm.currentEvent._id.$id, vm.currentEvent.players);
      vm.currentEvent.matches = result.data.matches;
      vm.match = {
        players: vm.currentEvent.players
      };
      return toaster.pop('info', "Info", "Match was added !");
    });
  };
  vm.removeMatch = function(match) {
    return EventService.removeMatch(vm.currentEvent._id.$id, match.uid).then(function(result) {
      if (result.status) {
        return vm.currentEvent = result.data;
      }
    });
  };
  vm.revertMatch = function(match) {
    angular.forEach(match.players, function(player) {
      var eventPlayer;
      eventPlayer = $filter('filter')(vm.currentEvent.players, {
        name: player.name
      });
      eventPlayer = eventPlayer.pop();
      console.log(player);
      console.log(eventPlayer);
      return eventPlayer.rating = player.rating;
    });
    return EventService.updatePlayerRating(vm.currentEvent._id.$id, vm.currentEvent.players).then(function() {
      return removeMatch(match);
    });
  };
  vm.getGames = function(input) {
    return GamesService.findGamesByName(input).then(function(result) {
      return result.data;
    });
  };
  vm.getGameImage = function(game) {
    var filteredArray;
    filteredArray = $filter('filter')(vm.games, {
      _id: game
    });
    game = filteredArray.pop();
    if (angular.isUndefined(game)) {
      return "";
    }
    return game.image_url || "";
  };
  vm.numMatches = function(player) {
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

  /*
    Get a filtered list of users that are not already in the current event
   */
  vm.availableUsers = function() {
    var usersToSelect;
    usersToSelect = $filter('filter')(vm.users, function(user) {
      var found;
      found = false;
      angular.forEach(vm.currentEvent.players, function(eventPlayer) {
        if (eventPlayer.name === user._id) {
          return found = true;
        }
      });
      return !found;
    });
    return usersToSelect;
  };
  vm.canEdit = function() {
    return $rootScope.user.admin || $rootScope.user._id === vm.currentEvent.owner;
  };
  vm["delete"] = function(event) {
    return EventService["delete"](event._id.$id).then(function(response) {
      return $location.path('/events');
    });
  };
  $scope.$watch('vm.match.files', function() {
    return vm.upload(vm.match.files);
  });
  vm.upload = function(files) {
    vm.match.images = [];
    if (files && files.length) {
      return angular.forEach(files, function(file) {
        return Utility.upload(file, 'match').then(function(response) {
          return vm.match.images.push(response.data.data);
        });
      });
    }
  };
  return vm;
};

EventController.resolve = {
  eventList: function(EventService, $rootScope) {
    if (angular.isDefined($rootScope.user)) {
      return EventService.query({
        query: {
          "players.name": $rootScope.user._id
        }
      });
    }
  },
  gamesList: function(GamesService) {
    return GamesService.query();
  },
  userList: function(UserService) {
    return UserService.query();
  },
  event: function($location, EventService) {
    var parts;
    parts = $location.$$url.split('/');
    return EventService.query({
      _id: parts[2]
    });
  }
};

this.EventListController = function($location, EventService, eventList) {
  var vm;
  vm = this;
  vm.events = eventList.data;
  vm.selectEvent = function(event) {
    return $location.path('/event/' + event._id.$id);
  };
  return vm;
};

EventListController.resolve = {
  eventList: function(EventService, $rootScope) {
    if (angular.isDefined($rootScope.user)) {
      return EventService.query({
        query: {
          "players.name": $rootScope.user._id
        }
      });
    }
  }
};

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.EventServiceWrapper = function(BaseService, Utility) {
  var EventService;
  EventService = (function(superClass) {
    extend(EventService, superClass);

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

this.GameGameController = function($interval, $filter, gamesList) {
  var activation, findGames, play, reset, selectGame, timer, unselectGame, vm;
  vm = this;
  vm.games = gamesList.data;
  vm.selectedGames = [];
  vm.selectedGame = null;
  timer = null;
  vm.playableGames = [];
  vm.inputs = {
    allow_split: false,
    num_players: 2
  };
  vm.states = {
    playing: false,
    finished: false
  };
  selectGame = function(game) {
    return vm.selectedGames.push(angular.copy(game));
  };
  unselectGame = function(game) {
    var idx;
    idx = vm.selectedGames.indexOf(game);
    return vm.selectedGames.splice(idx, 1);
  };
  findGames = function(numPlayers) {
    return vm.playableGames = $filter('games')(vm.games, numPlayers, vm.inputs.allow_split);
  };
  play = function() {
    angular.forEach(vm.selectedGames, function(e) {
      return e.vanish = false;
    });
    vm.states.playing = true;
    return timer = $interval(function() {
      var filteredGames, index;
      filteredGames = $filter('filter')(vm.selectedGames, {
        vanish: false
      });
      if (filteredGames.length === 1) {
        vm.states.finished = true;
        return $interval.cancel(timer);
      }
      index = Math.floor(Math.random() * filteredGames.length);
      return filteredGames[index].vanish = true;
    }, 3000);
  };
  reset = function() {
    vm.states = {
      playing: false,
      finished: false
    };
    vm.selectedGame = null;
    return vm.selectedGames = [];
  };
  activation = function() {
    return findGames(vm.inputs.num_players);
  };
  activation();
  vm.selectGame = selectGame;
  vm.unselectGame = unselectGame;
  vm.findGames = findGames;
  vm.play = play;
  vm.reset = reset;
  return vm;
};

GameGameController.resolve = {
  gamesList: function(GamesService) {
    return GamesService.query();
  }
};

this.GamesController = function($filter, $scope, GamesService, gameList, Utility) {
  var add, edit, removeGame, saveGame, vm;
  vm = this;
  vm.games = gameList.data;
  vm.newGame = {};
  vm.mode = 'list';
  vm.durationOptions = [
    {
      key: 0,
      text: 'Freenzy (5 - 15 min)'
    }, {
      key: 1,
      text: 'Lets get it awn! (15 - 60 min)'
    }, {
      key: 2,
      text: 'Cum awn!(1 - 2 hours)'
    }, {
      key: 3,
      text: 'Jesus! (2 - 4 hours)'
    }, {
      key: 4,
      text: 'Sn00zey (4 hours+)'
    }
  ];
  vm.skillFactorOptions = [
    {
      key: 0,
      text: 'So much Random'
    }, {
      key: 1,
      text: 'Random'
    }, {
      key: 2,
      text: 'Skill game with a twist of ransom !'
    }, {
      key: 3,
      text: 'Pure skillaz'
    }
  ];
  saveGame = function(game) {
    if (angular.isUndefined(game._id)) {
      return GamesService.insert(game).then(function(result) {
        if (result.status) {
          return vm.games.push(result.data);
        }
      });
    } else {
      return GamesService.update({
        _id: game._id,
        doc: game
      }).then(function(response) {
        if (vm.mode === 'add') {
          if (response.status) {
            vm.games.push(response.data);
          }
          return vm.mode = 'list';
        }
      });
    }
  };
  removeGame = function(game) {
    return GamesService["delete"](game._id).then(function() {
      var idx;
      idx = vm.games.indexOf(game);
      return vm.games.splice(idx, 1);
    });
  };
  edit = function(game) {
    vm.mode = 'edit';
    return vm.newGame = game;
  };
  add = function() {
    vm.mode = 'add';
    return vm.newGmae = {};
  };
  $scope.$watch('vm.files', function(n, o) {
    if (n !== o && n !== null && angular.isDefined(n)) {
      return vm.upload(vm.files);
    }
  });
  vm.upload = function(files) {
    if (angular.isUndefined(vm.newGame.images)) {
      vm.newGame.images = [];
    }
    if (files && files.length) {
      return angular.forEach(files, function(file) {
        return Utility.upload(file, 'game').then(function(response) {
          return vm.newGame.images.push(response.data.data);
        });
      });
    }
  };
  vm.findGameByQuery = function(query) {
    var q;
    q = {};
    if (query.length > 0) {
      q = {
        _id: query
      };
    }
    return GamesService.query(q).then(function(response) {
      return vm.games = response.data;
    });
  };
  vm.saveGame = saveGame;
  vm.removeGame = removeGame;
  vm.edit = edit;
  return vm;
};

GamesController.resolve = {
  gameList: function(GamesService) {
    return GamesService.query();
  }
};

this.GamesFilter = function() {
  var filter;
  filter = function(games, numPlayers, allowSplit) {
    var out;
    out = [];
    if (allowSplit) {
      angular.forEach(games, function(e) {
        if (angular.isDefined(e.min_players) && e.min_players <= numPlayers) {
          return out.push(e);
        }
      });
    } else {
      angular.forEach(games, function(e) {
        if (angular.isDefined(e.min_players) && e.min_players <= numPlayers && numPlayers <= e.max_players) {
          return out.push(e);
        }
      });
    }
    return out;
  };
  return filter;
};

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.GamesServiceWrapper = function(BaseService) {
  var GamesService;
  GamesService = (function(superClass) {
    extend(GamesService, superClass);

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

this.ProfileController = function($rootScope, UserService) {
  var vm;
  vm = this;
  vm.user = $rootScope.user;
  return console.log(vm.user, $rootScope.user);
};

ProfileController.resolve = {};

this.UserController = function($filter, userList, UserService) {
  var remove, save, vm;
  vm = this;
  vm.users = userList.data;
  vm.newUser = {};
  save = function(user) {
    var existing;
    existing = $filter('filter')(vm.users, function(u) {
      return u._id === user._id;
    });
    if (existing.length === 0) {
      return UserService.insert(user).then(function(result) {
        if (result.status) {
          return vm.users.push(result.data);
        }
      });
    } else {
      return UserService.update({
        _id: user._id,
        doc: user
      });
    }
  };
  remove = function(user) {
    return UserService["delete"](user._id).then(function() {
      var idx;
      idx = vm.users.indexOf(user);
      return vm.users.splice(idx, 1);
    });
  };
  vm.save = save;
  vm.remove = remove;
  return vm;
};

UserController.resolve = {
  userList: function(UserService) {
    return UserService.query();
  }
};

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.UserServiceWrapper = function(BaseService) {
  var UserService;
  UserService = (function(superClass) {
    extend(UserService, superClass);

    function UserService() {
      return UserService.__super__.constructor.apply(this, arguments);
    }

    UserService.prototype.findUserByName = function(name) {
      return this.query({
        doc: {
          _id: name
        }
      });
    };

    return UserService;

  })(BaseService);
  return new UserService('users');
};

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

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.WishServiceWrapper = function(BaseService) {
  var WishService;
  WishService = (function(superClass) {
    extend(WishService, superClass);

    function WishService() {
      return WishService.__super__.constructor.apply(this, arguments);
    }

    return WishService;

  })(BaseService);
  return new WishService('wishe');
};

this.app = angular.module('matchtracker', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'toaster', 'LocalStorageModule', 'ngFileUpload']).directive('back', HistoryBack).filter('range', RangeFilter).filter('games', GamesFilter).factory('Utility', Utility).factory('AuthService', AuthServiceWrapper).factory('EventService', EventServiceWrapper).factory('GamesService', GamesServiceWrapper).factory('WishService', WishServiceWrapper).factory('UserService', UserServiceWrapper).factory('BaseService', BaseServiceWrapper).controller('ApplicationController', ApplicationController).controller('AuthController', AuthController).controller('GameGameController', GameGameController).controller('GamesController', GamesController).controller('UserController', UserController).controller('EventController', EventController).controller('EventListController', EventListController).controller('CreateEventController', CreateEventController).controller('NavigationController', NavigationController).controller('WishListController', WishListController).controller('CreateWishController', CreateWishController).controller('ProfileController', ProfileController).config(function($routeProvider) {
  $routeProvider.when('/gamegame', {
    templateUrl: 'src/modules/games/gamegame.html',
    controller: 'GameGameController',
    controllerAs: 'vm',
    resolve: GameGameController.resolve
  });
  $routeProvider.when('/games', {
    templateUrl: 'src/modules/games/games.html',
    controller: 'GamesController',
    controllerAs: 'vm',
    resolve: GamesController.resolve
  });
  $routeProvider.when('/events', {
    templateUrl: 'src/modules/events/eventList.html',
    controller: 'EventListController',
    controllerAs: 'vm',
    resolve: EventListController.resolve
  });
  $routeProvider.when('/event/:name', {
    templateUrl: 'src/modules/events/event.html',
    controller: 'EventController',
    controllerAs: 'vm',
    resolve: EventController.resolve
  });
  $routeProvider.when('/events/create', {
    templateUrl: 'src/modules/events/createEvent.html',
    controller: 'CreateEventController',
    controllerAs: 'vm',
    resolve: CreateEventController.resolve
  });
  $routeProvider.when('/wishlist', {
    templateUrl: 'src/modules/wishes/wishList.html',
    controller: 'WishListController',
    controllerAs: 'vm',
    resolve: WishListController.resolve
  });
  $routeProvider.when('/createWish', {
    templateUrl: 'src/modules/wishes/createWish.html',
    controller: 'CreateWishController',
    controllerAs: 'vm'
  });
  $routeProvider.when('/users', {
    templateUrl: 'src/modules/users/users.html',
    controller: 'UserController',
    controllerAs: 'vm',
    requireAdmin: true,
    resolve: UserController.resolve
  });
  $routeProvider.when('/login', {
    templateUrl: 'src/modules/auth/login.html',
    controller: 'AuthController',
    controllerAs: 'vm'
  });
  $routeProvider.when('/profile', {
    templateUrl: 'src/modules/users/profile.html',
    controller: 'ProfileController',
    controllerAs: 'vm'
  });
  return $routeProvider.otherwise({
    redirectTo: '/events'
  });
}).config(function(localStorageServiceProvider) {
  return localStorageServiceProvider.setPrefix('matchtracker');
}).run(function($rootScope, $location) {
  $rootScope.edit = false;
  return $rootScope.initPath = $location.path();
});
