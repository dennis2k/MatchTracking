@GamesController = ($filter,$scope, GamesService, gameList,Utility) ->
  vm = this

  vm.games = gameList.data
  vm.newGame = {}
  vm.mode = 'list'
  vm.durationOptions = [
    {key : "0.1", text : '0.1 - Super ultra hyper frenzy'},
    {key : "0.2", text : '0.2'},
    {key : '0.3', text : '0.3'},
    {key : '0.4', text : '0.4'},
    {key : '0.5', text : '0.5'},
    {key : '0.6', text : '0.6'},
    {key : '0.7', text : '0.7'},
    {key : '0.8', text : '0.8'},
    {key : '0.9', text : '0.9'},
    {key : '1.0', text : '1.0 - Regular'},
    {key : '1.1', text : '1.1'},
    {key : '1.2', text : '1.2'},
    {key : '1.3', text : '1.3'},
    {key : '1.4', text : '1.4'},
    {key : '1.5', text : '1.5'},
    {key : '1.6', text : '1.6'},
    {key : '1.7', text : '1.7'},
    {key : '1.8', text : '1.8'},
    {key : '1.9', text : '1.9'},
    {key : '2.0', text : '2.0'},
    {key : '2.1', text : '2.1'},
    {key : '2.2', text : '2.2'},
    {key : '2.3', text : '2.3'},
    {key : '2.4', text : '2.4'},
    {key : '2.5', text : '2.5 - Twillight'}
  ]
  vm.skillFactorOptions = [
    {key : "0.1", text : '0.1 - Pure random'},
    {key : "0.2", text : '0.2'},
    {key : '0.3', text : '0.3'},
    {key : '0.4', text : '0.4'},
    {key : '0.5', text : '0.5'},
    {key : '0.6', text : '0.6'},
    {key : '0.7', text : '0.7'},
    {key : '0.8', text : '0.8'},
    {key : '0.9', text : '0.9'},
    {key : '1.0', text : '1.0 - Half skill, half random'},
    {key : '1.1', text : '1.1'},
    {key : '1.2', text : '1.2'},
    {key : '1.3', text : '1.3'},
    {key : '1.4', text : '1.4'},
    {key : '1.5', text : '1.5'},
    {key : '1.6', text : '1.6'},
    {key : '1.7', text : '1.7'},
    {key : '1.8', text : '1.8'},
    {key : '1.9', text : '1.9'},
    {key : '2.0', text : '2.0 - Pure mad skillaz'},
  ]


  saveGame = (game) ->
    if angular.isUndefined(game._id)
      GamesService.insert(game).then((result) ->
        vm.games.push(result.data) if result.status
      )
    else
      GamesService.update({_id : game._id, doc : game}).then((response) ->
        if(vm.mode == 'add')
          vm.games.push(response.data) if response.status
          vm.mode = 'list'
      )
  removeGame = (game) ->
    GamesService.delete(game._id).then(() ->
      idx = vm.games.indexOf(game)
      vm.games.splice(idx,1);
    )

  edit = (game) ->
    vm.mode = 'edit'
    vm.newGame = game

  add = () ->
    vm.mode = 'add'
    vm.newGmae = {}

  $scope.$watch('vm.files', (n,o) ->
    if(n != o && n != null && angular.isDefined(n))
      vm.upload(vm.files)
   )

  vm.upload = (files) ->
    vm.newGame.images = [] if angular.isUndefined(vm.newGame.images)
    if (files && files.length)
      angular.forEach(files,(file) ->
        Utility.upload(file,'game').then((response) ->
          vm.newGame.images.push(response.data.data)
     ))

  vm.findGameByQuery = (query) ->
    q = {}
    q = {_id: query} if (query.length > 0)
    GamesService.query(q).then((response) ->
      vm.games = response.data
     )

  vm.saveGame = saveGame
  vm.removeGame = removeGame
  vm.edit = edit
  vm

GamesController.resolve = {
  gameList : (GamesService) ->
    GamesService.query()
}