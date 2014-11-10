@EventService = (CommonService, Utility) ->
  service = {}
  service.collection = 'events'

  query = (params) ->
    CommonService.query(service.collection,params);
  insert = (params) ->
    CommonService.create(service.collection,params);
  update = (params) ->
    CommonService.update(service.collection,params);
  _delete = (id) ->
    CommonService.delete(service.collection,id);

  addMatch = (id,match) ->
    match.uid = Utility.guid()
    match.timestamp = new Date().getTime() + ""
    service.update(
      {_id : id, doc : { $push : { matches : match } }}
    )
  removeMatch = (id,uid) ->
    service.update(
      {_id : id, doc : { $pull : { matches : { uid : uid} } } }
    )
  addPlayer = (id,player) ->
    service.update(
      {_id : id, doc : { $addToSet : { players : { name : player, rating : 1000 } } } }
    )
  removePlayer = (id,player) ->
    service.update(
      {_id : id, doc : { $pull : { players : { name : player.name } } } }
    )
  updatePlayerRating = (id, players) ->
    service.update(
      { _id : id, doc : { $set : { players : players}}}
    )
  cheat = (code) ->
    CommonService.query('cheat',{code : code});

  service.query = query
  service.insert = insert
  service.delete = _delete
  service.update = update
  service.addMatch = addMatch
  service.removeMatch = removeMatch
  service.addPlayer = addPlayer
  service.removePlayer = removePlayer
  service.updatePlayerRating = updatePlayerRating
  service.cheat = cheat
  service