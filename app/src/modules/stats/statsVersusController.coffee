@StatsVersusController = ($rootScope, $filter, users, games, EventService) ->
  vm = this
  vm.playerList = users.data
  vm.gamesList = games.data
  vm.gamesList.unshift({_id : 'Any Game'})

  vm.getPlayerList = (player) ->
    list = $filter('filter')(vm.playerList,(element) ->
      player != element._id
    )
    list

  vm.fight = (player1, player2) ->
    EventService.query({ query : { "matches.players.name" : { $all : [player1, player2] } }}).then((response) ->
      console.log(response)
    )

  vm

StatsVersusController.resolve = {
  users : (UserService) ->
    UserService.query()
  games : (GamesService) ->
    GamesService.query()

}