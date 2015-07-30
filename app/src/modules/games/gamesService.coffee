@GamesServiceWrapper = (BaseService) ->
  class GamesService extends BaseService

    findGamesByName : (name) ->
      @query({ _id : name, })

  return new GamesService('games')

