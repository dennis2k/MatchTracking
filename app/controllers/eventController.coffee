@EventController = ($rootScope, $filter, EventService, GamesService, AlertService, eventList, gamesList) ->
  vm = this
  vm.events = eventList.data
  vm.games = gamesList.data
  vm.currentEvent = {}
  vm.match = {}
  vm.root = $rootScope;

  # Load event data
  loadEvent = (event) ->
    console.log(event)
    params =
      _id : event._id.$id
    EventService.query(params).then((result) ->
      vm.currentEvent = result.data.pop()
    )

  # Add a player to the event
  addPlayer = (player) ->
    return null if !player?
    vm.currentEvent.players.push(player)
    EventService.addPlayer(vm.currentEvent._id.$id,player).then((result) ->
      vm.currentEvent = result.data if result.status
      vm.player = null;
    );

  # Removes a player from the event
  removePlayer = (player) ->
    EventService.removePlayer(vm.currentEvent._id.$id,player).then((result) ->
      vm.currentEvent = result.data if result.status
    )

  # Adds a player to a match
  addPlayerToMatch = (player) ->
    vm.match.players = [] if !vm.match.players?
    filteredArray = $filter('filter')(vm.currentEvent.players,{name : player.name})
    matchPlayer = filteredArray.pop()
    matchPlayer.rank = player.rank
    vm.match.players.push(angular.copy(matchPlayer))

  # Removes a player from a match
  removePlayerFromMatch = (player) ->
    idx = vm.match.players.indexOf(player)
    vm.match.players.splice(idx,1);

  # Adds a match to the event
  addMatch = (match) ->
    if angular.isUndefined(vm.match.players) || vm.match.players.length < 2
      return AlertService.warning("At least two players need to participate in a match")

    m = new EloCalculator(match.players)
    m.calculateNewRating();
    EventService.addMatch(vm.currentEvent._id.$id,match).then((result) ->
      for player in match.players
        console.log(player)
        filteredArray = $filter('filter')(vm.currentEvent.players,{name : player.name})
        eventPlayer = filteredArray.pop()
        eventPlayer.rating = player.new_rating
        delete eventPlayer.rank
#        delete eventPlayer.new_rating
      EventService.updatePlayerRating(vm.currentEvent._id.$id,vm.currentEvent.players)
      vm.currentEvent.matches.push(match);
      vm.match = {};

    )
  # Removes a match from an event
  removeMatch = (match) ->
    EventService.removeMatch(vm.currentEvent._id.$id,match.uid).then((result) ->
      vm.currentEvent = result.data if result.status
    )
  # Auto complete searching for games
  getGames = (input) ->
    GamesService.findGamesByName(input).then((result) ->
      result.data
    )

  getGameImage = (game) ->
    filteredArray = $filter('filter')(vm.games,{_id : game})
    game = filteredArray.pop()
    game.image_url|| "";

  numMatches = (player) ->
    count = 0
    angular.forEach(vm.currentEvent.matches,(match,mindex) ->
      angular.forEach(match.players,(p,pindex) ->
         count++ if p.name == player.name
      )
    )
    count

  # API
  vm.addPlayerToMatch = addPlayerToMatch
  vm.removePlayerFromMatch = removePlayerFromMatch
  vm.loadEvent = loadEvent
  vm.addPlayer = addPlayer
  vm.removePlayer = removePlayer
  vm.addMatch = addMatch
  vm.removeMatch = removeMatch
  vm.getGames = getGames
  vm.getGameImage = getGameImage
  vm.numMatches = numMatches
  vm.canEdit = $rootScope.edit ? true : false;


  vm

EventController.resolve =
  eventList : (EventService) ->
    EventService.query()
  gamesList : (GamesService) ->
    GamesService.query()