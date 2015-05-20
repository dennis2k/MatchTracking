@StatsServiceWrapper = (BaseService,$q,$filter) ->
  class StatsService extends BaseService

    getPlayerRank = (player, match) ->
      players = $filter('filter')(match.players,(p) ->
        return p.name == player
      )
      players[0].rank

    parseVersusResult = (p1,p2,matches) ->
      result = { games : {}}
      result[p1] = {wins : 0, draws : 0, loss : 0}
      result[p2] = {wins : 0, draws : 0, loss : 0}

      angular.forEach(matches,(match) ->
        if(angular.isDefined(match.game))
          if(angular.isDefined(result.games[match.game]))
            result.games[match.game]++
          else
            result.games[match.game] = 1


        p1Rank = getPlayerRank(p1,match)
        p2Rank = getPlayerRank(p2,match)
        if(p1Rank == p2Rank)
          result[p1].draws++
          result[p2].draws++
        if(p1Rank > p2Rank)
          result[p1].wins++
          result[p2].loss++
        if(p2Rank > p1Rank)
          result[p1].loss++
          result[p2].wins++
      )
      result

    versus : (p1,p2,game = null) ->
      defer = $q.defer()
      @get('/versus',{player1 : p1, player2 : p2, game : game}).then((response) ->

        return defer.resolve(parseVersusResult(p1,p2,response.data))
      ,
        (response) ->
          defer.reject(response)
      )
      defer.promise


  return new StatsService('stats')

