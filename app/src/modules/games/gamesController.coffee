@GamesController = ($filter,$scope, GamesService, gameList,Utility) ->
  vm = this

  vm.games = gameList.data
  vm.newGame = {}
  vm.mode = 'list'
  vm.durationOptions = [
    {key : 0, text : 'Freenzy (5 - 15 min)'},
    {key : 1, text : 'Lets get it awn! (15 - 60 min)'},
    {key : 2, text : 'Cum awn!(1 - 2 hours)'},
    {key : 3, text : 'Jesus! (2 - 4 hours)'},
    {key : 4, text : 'Sn00zey (4 hours+)'}
  ]
  vm.skillFactorOptions = [
    {key : 0, text : 'So much Random'},
    {key : 1, text : 'Random'},
    {key : 2, text : 'Skill game with a twist of ransom !'},
    {key : 3, text : 'Pure skillaz'},
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