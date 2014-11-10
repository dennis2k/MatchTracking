@GameGameController = ($interval, gamesList) ->
  vm = this
  vm.games = gamesList.data
  vm.selectedGames = []
  vm.playing = false
  timer = null
  selectGame = (game) ->
    vm.selectedGames.push(game)

  play = () ->
    vm.playing = true
    timer = $interval(() ->
      if(vm.selectedGames.length == 1)
        return $interval.cancel(timer)
      index = Math.floor(Math.random() * vm.selectedGames.length);
      console.log(index)
      vm.selectedGames.splice(index,1)
    ,
    2000)

  vm.selectGame = selectGame
  vm.play = play
  vm

GameGameController.resolve =
  gamesList : (GamesService) ->
    GamesService.query()
