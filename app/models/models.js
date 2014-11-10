(function() {
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
