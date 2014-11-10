(function() {
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
  this.CommonService = function(HttpWrapper) {
    var create, query, service, update, _delete;
    service = {};
    query = function(service, params) {
      return HttpWrapper.get(service + "/query", params);
    };
    create = function(service, params) {
      return HttpWrapper.post(service + "/create", params);
    };
    update = function(service, params) {
      return HttpWrapper.post(service + "/update", params);
    };
    _delete = function(service, id) {
      return HttpWrapper.post(service + "/remove", {
        id: id
      });
    };
    service.query = query;
    service.create = create;
    service.update = update;
    service["delete"] = _delete;
    return service;
  };

}).call(this);

(function() {
  this.EventService = function(CommonService, Utility) {
    var addMatch, addPlayer, cheat, insert, query, removeMatch, removePlayer, service, update, updatePlayerRating, _delete;
    service = {};
    service.collection = 'events';
    query = function(params) {
      return CommonService.query(service.collection, params);
    };
    insert = function(params) {
      return CommonService.create(service.collection, params);
    };
    update = function(params) {
      return CommonService.update(service.collection, params);
    };
    _delete = function(id) {
      return CommonService["delete"](service.collection, id);
    };
    addMatch = function(id, match) {
      match.uid = Utility.guid();
      match.timestamp = new Date().getTime() + "";
      return service.update({
        _id: id,
        doc: {
          $push: {
            matches: match
          }
        }
      });
    };
    removeMatch = function(id, uid) {
      return service.update({
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
    addPlayer = function(id, player) {
      return service.update({
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
    removePlayer = function(id, player) {
      return service.update({
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
    updatePlayerRating = function(id, players) {
      return service.update({
        _id: id,
        doc: {
          $set: {
            players: players
          }
        }
      });
    };
    cheat = function(code) {
      return CommonService.query('cheat', {
        code: code
      });
    };
    service.query = query;
    service.insert = insert;
    service["delete"] = _delete;
    service.update = update;
    service.addMatch = addMatch;
    service.removeMatch = removeMatch;
    service.addPlayer = addPlayer;
    service.removePlayer = removePlayer;
    service.updatePlayerRating = updatePlayerRating;
    service.cheat = cheat;
    return service;
  };

}).call(this);

(function() {
  this.GamesService = function(AlertService, CommonService, HttpWrapper) {
    var findGamesByName, insert, query, service, update, _delete;
    service = {};
    service.collection = 'games';
    query = function(params) {
      return CommonService.query(service.collection, params);
    };
    insert = function(params) {
      return CommonService.create(service.collection, params);
    };
    update = function(params) {
      return CommonService.update(service.collection, params);
    };
    _delete = function(id) {
      return CommonService["delete"](service.collection, id);
    };
    findGamesByName = function(name) {
      return CommonService.query(service.collection, {
        doc: {
          _id: name
        }
      });
    };
    service.query = query;
    service.insert = insert;
    service["delete"] = _delete;
    service.update = update;
    service.upload = HttpWrapper.upload;
    service.findGamesByName = findGamesByName;
    return service;
  };

}).call(this);

(function() {
  this.HttpWrapper = function($http, $q, $upload, AlertService) {
    var request, service, upload;
    service = {};
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
    upload = function(files) {
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
    service.get = function(url, params) {
      return request('get', url, params);
    };
    service.post = function(url, params) {
      return request('post', url, params);
    };
    service.upload = upload;
    return service;
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
