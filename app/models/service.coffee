class Service
  cosntructor : (name,commonService) ->
    @name = name;
    @service = commonService

  @query : (params) ->
    HttpWrapper.get(@name + "/query",params)
  @create : (params) ->
    HttpWrapper.post(@name + "/create",params)
  @_delete : (id) ->
    HttpWrapper.post(@name + "/remove",{id : id})
