@PlayerController = ($filter, PlayerService, playerList) ->
  vm = this

  vm.players = playerList.data

  vm.saveNewPlayer = (newPlayer) ->
    return null if !newPlayer.username?
    PlayerService.insert(newPlayer).then((result) ->
      vm.players.push(result.data) if result.status
    );

  vm.deletePlayer = (user) ->
    PlayerService.delete(user._id).then(() ->
      ix =  vm.players.indexOf(user);
      vm.players.splice(ix,1);
    )
  vm

PlayerController.resolve =
  playerList : (PlayerService) ->
    PlayerService.list();