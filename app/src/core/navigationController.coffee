@NavigationController = ($rootScope,$location,EventService) ->
  nav = this;
  nav.isActive = (viewLocation) ->
    if(viewLocation == $location.path())
      return true
    if($location.path().indexOf(viewLocation) > -1)
      return true
    return false

  nav.cheat = (code) ->
    EventService.cheat(code).then((result) ->
        $rootScope.edit = true if result.status
        nav.code = "";
    )

  nav