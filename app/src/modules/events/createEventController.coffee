@CreateEventController = ($location,$filter, EventService, userList, $rootScope) ->
  vm = this
  vm.users = userList.data
  vm.event = {}

  vm.saveEvent = (event) ->
    eventPlayers = []
    for player in vm.users
      if(player.include == true)
        eventPlayers.push({name : player._id, rating : 1000})

    event.players = eventPlayers
    event.owner = $rootScope.user._id
    EventService.insert({event}).then((result) ->
      $location.path('/events');
    )

  vm

CreateEventController.resolve =
  userList : (UserService) ->
    UserService.query()