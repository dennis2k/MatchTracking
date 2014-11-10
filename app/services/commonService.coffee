@CommonService = (HttpWrapper) ->

  service = {}

  query = (service,params) ->
    HttpWrapper.get(service + "/query",params)
  create = (service,params) ->
    HttpWrapper.post(service + "/create",params)
  update = (service,params) ->
    HttpWrapper.post(service + "/update",params)
  _delete = (service,id) ->
    HttpWrapper.post(service + "/remove",{id : id})

  service.query = query
  service.create = create
  service.update = update
  service.delete = _delete
  service