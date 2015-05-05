@NavigationController = ($rootScope,$location,EventService) ->
  nav = this;
  nav.isActive = (viewLocation) ->
    viewLocation == $location.path()

  nav.cheat = (code) ->
    EventService.cheat(code).then((result) ->
        $rootScope.edit = true if result.status
        nav.code = "";
    )

  nav