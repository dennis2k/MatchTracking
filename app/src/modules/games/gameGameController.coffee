@GameGameController = ($interval,$filter, gamesList) ->
  vm = this
  vm.games = gamesList.data
  vm.selectedGames = []
  vm.selectedGame = null
  timer = null
  vm.playableGames = [];
  vm.inputs = { allow_split : false, num_players : 2}
  vm.states = { playing : false, finished : false}

  #Select a game for game game
  selectGame = (game) ->
    vm.selectedGames.push(angular.copy(game))

  #Unselect game from game game
  unselectGame = (game) ->
    idx = vm.selectedGames.indexOf(game)
    vm.selectedGames.splice(idx,1)

  #Filter games based on the number of players selected
  findGames = (numPlayers) ->
    vm.playableGames = $filter('games')(vm.games,numPlayers,vm.inputs.allow_split);

  #Execute the actual game game
  play = () ->
    angular.forEach vm.selectedGames,(e) ->
      e.vanish = false

    vm.states.playing = true
    timer = $interval(() ->
      filteredGames = $filter('filter')(vm.selectedGames,{vanish : false})
      if(filteredGames.length == 1)
        vm.states.finished = true;
        return $interval.cancel(timer)
      index = Math.floor(Math.random() * filteredGames.length);
      filteredGames[index].vanish = true
    ,
    3000)

  reset = () ->
    vm.states = { playing : false, finished : false}
    vm.selectedGame = null
    vm.selectedGames = []

  #Run on controller initialization
  activation = () ->
    findGames(vm.inputs.num_players)
  activation()

  #API
  vm.selectGame = selectGame
  vm.unselectGame = unselectGame
  vm.findGames = findGames
  vm.play = play
  vm.reset = reset
  vm

GameGameController.resolve =
  gamesList : (GamesService) ->
    GamesService.query()
