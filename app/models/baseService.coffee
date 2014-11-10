class @BaseService
  name : null
  wrapper : null
  constructor : (name, wrapper) ->
    @name = name
    @wrapper = wrapper
  query : (params) ->
    @wrapper.get(service.name + "/query",params)
  create : (params) ->
    @wrapper.post(service.name + "/create",params)
  update : (params) ->
    @wrapper.post(service.name + "/update",params)
  delete : (id) ->
    @wrapper.post(service.name + "/remove",{id : id})

