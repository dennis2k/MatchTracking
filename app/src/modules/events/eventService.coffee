@EventServiceWrapper = (BaseService, Utility) ->

  class EventService extends BaseService

    addMatch : (id,match) ->
      match.uid = Utility.guid()
      match.timestamp = new Date().getTime() + ""
      @update( {_id : id, doc : { $push : { matches : match } }} )

    removeMatch : (id,uid) ->
      @update( {_id : id, doc : { $pull : { matches : { uid : uid} } } } )

    addPlayer : (id,player) ->
      @update( {_id : id, doc : { $addToSet : { players : { name : player, rating : 1000 } } } } )

    removePlayer : (id,player) ->
      @update( {_id : id, doc : { $pull : { players : { name : player.name } } } } )

    updatePlayerRating : (id, players) ->
      @update( { _id : id, doc : { $set : { players : players}}} )

    cheat : (code) ->
      @route = 'cheat';
      @query({code : code});

  return new EventService('events')