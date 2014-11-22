@BaseServiceWrapper = ($http, $q, $upload) ->

  #All services inherit common API calls
  class @BaseService
    constructor : (route) ->
      @route = route;

    #Private method for handling all http requests
    request = (method,url,params) ->
      params = {} if angular.isUndefined(params)
      deferred = $q.defer();
      $http({
            url : 'service.php/' + url,
            method : method,
            params : params
            })
            .success((response) ->
              deferred.resolve(response)
              (response.status && AlertService.info(response.message) || AlertService.error(response.message)) if !!response.message
            )
            .error((response) ->
                deferred.reject(response)
                AlertService.error(response.message)
            )
      deferred.promise;

    query : (params) ->
      request('get', @route+ "/query",params)
    insert : (params) ->
      request('post', @route + "/create",params)
    update : (params) ->
      request('post', @route + "/update",params)
    delete : (id) ->
      request('post', @route + "/remove",{id : id})
    upload : (files) ->
      deferred = $q.defer();
      $upload
        .upload({
                url: 'service.php/' + @route+ '/upload',
                method: 'post',
                file: files[0]
                })
        .success((response) ->
                  deferred.resolve(response.data)
                  (response.status && AlertService.info(response.message) || AlertService.error(response.message)) if !!response.message
                )
        .error((response) ->
                deferred.reject(response.data);
              )