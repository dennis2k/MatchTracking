@EventController = (event, $rootScope, $filter,$scope, $location, toaster, EventService, GamesService, eventList, gamesList, userList,Utility) ->
  vm = this
  vm.games = gamesList.data
  vm.users = userList.data
  vm.currentEvent = event.data[0]
  vm.match = { players : vm.currentEvent.players }
  vm.root = $rootScope;

  vm.selectEvent = (event) ->
    $location.path('/event/' + event.name)


  # Add a player to the event
  vm.addPlayer = (player) ->
    return null if !player?
    vm.currentEvent.players.push(player)
    EventService.addPlayer(vm.currentEvent._id.$id,player._id).then((result) ->
      vm.currentEvent = result.data if result.status
      vm.player = null;
    )

  # Removes a player from the event
  vm.removePlayer = (player) ->
    EventService.removePlayer(vm.currentEvent._id.$id,player).then((result) ->
      vm.currentEvent = result.data if result.status
    )

  # Adds a player to a match
  vm.addPlayerToMatch = (player) ->
    vm.match.players = [] if !vm.match.players?
    filteredArray = $filter('filter')(vm.currentEvent.players,{name : player.name})
    matchPlayer = filteredArray.pop()
    matchPlayer.rank = player.rank
    vm.match.players.push(angular.copy(matchPlayer))

  # Removes a player from a match
  vm.removePlayerFromMatch = (player) ->
    idx = vm.match.players.indexOf(player)
    vm.match.players.splice(idx,1);

  # Adds a match to the event
  vm.addMatch = (match) ->
    filteredPlayers = $filter('filter')(match.players,(player) ->
      if player.rank == ''
        return false
      if player.is_not_participating
        return false
      return true
    )
    if(filteredPlayers.length == 0)
      toaster.pop('warning',"Warning!","No players selected for match")

    match.players = filteredPlayers
    m = new EloCalculator(match.players)
    m.calculateNewRating();
    EventService.addMatch(vm.currentEvent._id.$id,match).then((result) ->
      for player in match.players
        filteredArray = $filter('filter')(vm.currentEvent.players,{name : player.name})
        eventPlayer = filteredArray.pop()
        eventPlayer.rating = player.new_rating
        delete eventPlayer.rank
        delete eventPlayer.is_not_participating
      EventService.updatePlayerRating(vm.currentEvent._id.$id,vm.currentEvent.players)
      vm.currentEvent.matches = result.data.matches
      vm.match = {players : vm.currentEvent.players};
      toaster.pop('info',"Info","Match was added !")
    )
  # Removes a match from an event
  vm.removeMatch = (match) ->
    EventService.removeMatch(vm.currentEvent._id.$id,match.uid).then((result) ->
      vm.currentEvent = result.data if result.status
    )

  #Roll back the points given to players paticipating in this game and delete the game
  vm.revertMatch = (match) ->
    angular.forEach match.players, (player) ->
      eventPlayer = $filter('filter')(vm.currentEvent.players,{name : player.name})
      eventPlayer = eventPlayer.pop()
      console.log(player)
      console.log(eventPlayer)
      eventPlayer.rating = player.rating
    EventService.updatePlayerRating(vm.currentEvent._id.$id,vm.currentEvent.players).then () ->
      removeMatch(match)

  # Auto complete searching for games
  vm.getGames = (input) ->
    GamesService.findGamesByName(input).then((result) ->
      result.data
    )

  #get the image of a game
  vm.getGameImage = (game) ->

    filteredArray = $filter('filter')(vm.games,{_id : game})
    game = filteredArray.pop()
    return "" if(angular.isUndefined(game))
    game.image_url || "";

  #Calculate the number of matches for a player
  vm.numMatches = (player) ->
    count = 0
    angular.forEach(vm.currentEvent.matches,(match,mindex) ->
      angular.forEach(match.players,(p,pindex) ->
        count++ if p.name == player.name
      )
    )
    count

  ###
    Get a filtered list of users that are not already in the current event
  ###
  vm.availableUsers = () ->
    usersToSelect = $filter('filter')(vm.users,(user) ->
      found = false
      angular.forEach(vm.currentEvent.players,(eventPlayer) ->
        if(eventPlayer.name == user._id)
          found = true
      )
      !found
    )
    usersToSelect

  vm.canEdit = () ->
    ($rootScope.user.admin || $rootScope.user._id == vm.currentEvent.owner )

  vm.delete = (event) ->
    EventService.delete(event._id.$id).then((response) ->
        $location.path('/events')
    )
  $scope.$watch('vm.match.files', () ->
    vm.upload(vm.match.files)
  )

  vm.upload = (files) ->
    vm.match.images = []
    if (files && files.length)
      angular.forEach(files,(file) ->
        Utility.upload(file,'match').then((response) ->
          vm.match.images.push(response.data.data)
        ))

  vm
EventController.resolve =
  eventList : (EventService,$rootScope) ->
    if(angular.isDefined($rootScope.user))
      EventService.query({ query : { "players.name" : $rootScope.user._id } })
  gamesList : (GamesService) ->
    GamesService.query()
  userList : (UserService) ->
    UserService.query()
  event : ($location,EventService) ->
    parts = $location.$$url.split('/')
    EventService.query({_id : parts[2]})