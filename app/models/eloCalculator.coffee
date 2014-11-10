class @EloCalculator
  defaultRating : 1000
  k : 15
  players : {}
  constructor : (players) ->
    @players = players

  getKValue : (player) ->
#    return 10 if player.rating > @defaultRating
    return 15

  getActualScore : (player, opp) ->
    return 1 if player.rank < opp.rank
    return 0.5 if player.rank == opp.rank
    return 0 if player.rank > opp.rank

  getExpectedScore : (player,opp) ->
    diff = opp.rating - player.rating
    exp = diff / 400
    ea = 1 / (1 + Math.pow(10,exp))
    console.log("EA for player: " + player.name + " vs opponent " + opp.name + " = " +ea)
    ea
  calculateNewRating : () ->
    for player in @players
      subMatch = 0
      for opp in @players
        if (player.name != opp.name)
          subMatch += @getKValue(player) * (@getActualScore(player,opp) - @getExpectedScore(player,opp))
          console.log("Current submatch for player " + player.name)
      console.log("Adjustment for player: " + player.name + " -  " + subMatch)
      player.new_rating = Math.round((player.rating + subMatch) * 100) / 100
      player.adjustment = Math.round(subMatch * 100) / 100
    @player