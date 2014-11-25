@GamesFilter = () ->
  filter = (games, numPlayers,allowSplit) ->
    out = []
    if allowSplit
      angular.forEach(games,(e) ->
        if angular.isDefined(e.min_players) && e.min_players <= numPlayers
          out.push(e)
      )
    else
      angular.forEach(games,(e) ->
        if angular.isDefined(e.min_players) && e.min_players <= numPlayers && numPlayers <= e.max_players
          out.push(e)
      )
    out
  filter
