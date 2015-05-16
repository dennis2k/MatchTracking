@EventListController = ($location, EventService, eventList) ->
  vm = this
  vm.events = eventList.data

  vm.now = new Date().getTime()

  vm.selectEvent = (event) ->
    $location.path('/event/' + event._id.$id)

  vm
EventListController.resolve =
  eventList : (EventService,$rootScope) ->
    if(angular.isDefined($rootScope.user))
      EventService.query({ query : { "players.name" : $rootScope.user._id } })