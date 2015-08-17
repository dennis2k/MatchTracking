@CreateEventController = ($location,$filter,$scope, EventService, userList, $rootScope,Utility) ->
  vm = this
  vm.users = userList.data
  vm.event = {}
  vm.files = []

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

  $scope.$watch('vm.files', (n,o) ->
    if(n != o && n != null && angular.isDefined(n))
      vm.upload(vm.files)
  )

  vm.upload = (files) ->
#    vm.event.images = [] if angular.isUndefined(vm.event.images)
    if (files && files.length)
      angular.forEach(files,(file) ->
        Utility.upload(file,'game').then((response) ->
          vm.event.image_url = response.data.data
      ))

  convertDateToTime = (date) ->
    d = new Date(date)
    d.getTime()

  vm.openDatePicker = ($event) ->
    $event.preventDefault();
    $event.stopPropagation();
    vm.opened = true;
  vm

CreateEventController.resolve =
  userList : (UserService) ->
    UserService.query()