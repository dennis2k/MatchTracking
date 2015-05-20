@StatsVersusController = ($rootScope, $filter, users, games, StatsService) ->
  vm = this
  vm.playerList = users.data
  vm.gamesList = games.data

  vm.ratioLabels = ['Wins','Loss','Draws']
  vm.p1 = { ratio : []}
  vm.p2 = { ratio : []}

  vm.gamesList.unshift({_id : 'Any Game'})

  vm.getPlayerList = (player) ->
    list = $filter('filter')(vm.playerList,(element) ->
      player != element._id
    )
    list

  vm.fight = (player1, player2,game) ->
    game = null if(game == 'Any Game' || angular.isUndefined(game))
    StatsService.versus(player1,player2,game).then((response) ->
      vm.gameLabels = [];
      vm.gameCount = [];
      vm.p1.ratio = [response[player1].wins,response[player1].loss,response[player1].draws]
      vm.p2.ratio = [response[player2].wins,response[player2].loss,response[player2].draws]
      angular.forEach(response.games,(count,game) ->
        vm.gameLabels.push(game)
        vm.gameCount.push(count)
      )
    )

  vm

StatsVersusController.resolve = {
  users : (UserService) ->
    UserService.query()
  games : (GamesService) ->
    GamesService.query()

}