@GamesServiceWrapper = (BaseService) ->
  class GamesService extends BaseService

    findGamesByName : (name) ->
      @query({ doc : { _id : name, } })

  return new GamesService('games')

