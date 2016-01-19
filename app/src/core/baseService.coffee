@BaseServiceWrapper = ($http, $q,toaster) ->

  #All services inherit common API calls
  class @BaseService
    constructor : (route) ->
      @route = route;

    #Private method for handling all http requests
    request = (method,url,params) ->
      params = {} if angular.isUndefined(params)
      deferred = $q.defer()
      $http {
              url : 'service.php/' + url
              method : method
              params : params
            }
            .success (response) ->
              if response.status && !!response.message
                toaster.pop "success","Info!", response.message
              if response.status == false
                toaster.pop "error","Error!", response.message
              deferred.resolve(response)

            .error (response) ->
                toaster.pop "error","Error!", response.message
                deferred.reject(response)
      deferred.promise;

    getById : (id) ->
      @query({ doc : { _id : id, } })
    query : (params) ->
      request('get', @route+ "/query",params)
    insert : (params) ->
      request('post', @route + "/create",params)
    update : (params) ->
      request('post', @route + "/update",params)
    delete : (id) ->
      request('post', @route + "/remove",{id : id})