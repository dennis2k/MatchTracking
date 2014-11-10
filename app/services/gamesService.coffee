@GamesService = (AlertService, CommonService, HttpWrapper) ->
  service = {}
  service.collection = 'games'

  query = (params) ->
    CommonService.query(service.collection,params)
  insert = (params) ->
    CommonService.create(service.collection,params)
  update = (params) ->
    CommonService.update(service.collection,params)
  _delete = (id) ->
    CommonService.delete(service.collection,id)
  findGamesByName = (name) ->
    CommonService.query(service.collection,{ doc : { _id : name, } } )

  service.query = query
  service.insert = insert
  service.delete = _delete
  service.update = update
  service.upload = HttpWrapper.upload
  service.findGamesByName = findGamesByName
  service

