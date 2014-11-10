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
