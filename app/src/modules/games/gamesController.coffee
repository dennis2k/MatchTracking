@GamesController = ($filter,$scope, GamesService, gameList,Utility,toaster) ->
  vm = this

  vm.games = gameList.data
  vm.newGame = {}
  vm.mode = 'list'
  vm.skillFactorOptions = [
    {key : -0.9, text : '-0.9 - Pure random'},
    {key : -0.8, text : '-0.8'},
    {key : -0.7, text : '-0.7'},
    {key : -0.6, text : '-0.6'},
    {key : -0.5, text : '-0.5'},
    {key : -0.4, text : '-0.4'},
    {key : -0.3, text : '-0.3'},
    {key : -0.2, text : '-0.2'},
    {key : -0.1, text : '-0.1'},
    {key : 0.0, text : '0.0 - Regular'}
    {key : 0.1, text : '0.1'},
    {key : 0.2, text : '0.2'},
    {key : 0.3, text : '0.3'},
    {key : 0.4, text : '0.4'},
    {key : 0.5, text : '0.5'},
    {key : 0.6, text : '0.6'},
    {key : 0.7, text : '0.7'},
    {key : 0.8, text : '0.8'},
    {key : 0.9, text : '0.9 - Mad skills'},
  ]


  saveGame = (game) ->
    if angular.isUndefined(game._id)
      GamesService.insert(game).then((result) ->
        vm.games.push(result.data) if result.status
        toaster.pop('info',"Info","Game created!")
        vm.mode = 'list'
      )
    else
      GamesService.update({_id : game._id, doc : game}).then((response) ->
        if(vm.mode == 'add')
          vm.games.push(response.data) if response.status
        vm.mode = 'list'
        toaster.pop('info',"Info","Game updated!")
      )

  removeGame = (game) ->
    GamesService.delete(game._id).then(() ->
      idx = vm.games.indexOf(game)
      vm.games.splice(idx,1);
    )

  removeImg = (img) ->
    console.log("CLICK")
    idx = vm.newGame.images.indexOf(img)
    vm.newGame.images.splice(idx,1);
    console.log(idx,img)


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
  vm.removeImg = removeImg
  vm

GamesController.resolve = {
  gameList : (GamesService) ->
    GamesService.query()
}