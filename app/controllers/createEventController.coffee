@CreateEventController = ($location, EventService) ->
  vm = this

  vm.event = {}

  vm.saveEvent = (event) ->
    EventService.insert(event).then((result) ->
      $location.path('/events');
    )

  vm