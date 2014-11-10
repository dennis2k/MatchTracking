@GamesController = ($filter, GamesService, gameList) ->
  vm = this

  vm.games = gameList.data
  vm.newGame = {}
  saveGame = (game) ->
    GamesService.insert(game).then((result) ->
      vm.games.push(result.data) if result.status
    )
  removeGame = (game) ->
    GamesService.delete(game._id).then(() ->
      idx = vm.games.indexOf(game)
      vm.games.splice(idx,1);
    )

  uploadFile = (files) ->
    GamesService.upload(files).then((result) ->
      console.log(result.data);
      vm.newGame.image_url = result.data.data
    )

  vm.saveGame = saveGame
  vm.removeGame = removeGame
  vm.uploadFile = uploadFile
  vm

GamesController.resolve = {
  gameList : (GamesService) ->
    GamesService.query()
}