@HttpWrapper = ($http,$q,$upload,AlertService) ->
  service = {};

  request = (method,url,params) ->
    params = {} if angular.isUndefined(params)

    deferred = $q.defer();
    $http({
      url : 'service.php/' + url,
      method : method,
      params : params
    }).success((response) ->
      deferred.resolve(response)
      (response.status && AlertService.info(response.message) || AlertService.error(response.message)) if !!response.message
    )
    .error((response) ->
      deferred.reject(response)
      AlertService.error(response.message)
    )
    deferred.promise;

  upload = (files) ->
    deferred = $q.defer();
    $upload.upload({
      url: 'service.php/games/upload',
      method: 'post',
      file: files[0]
    }).success((response) ->
      deferred.resolve(response.data);
      (response.status && AlertService.info(response.message) || AlertService.error(response.message)) if !!response.message
    ).error((response) ->
      deferred.reject(response.data);
    )

  service.get = (url,params) ->
    request('get',url,params)
  service.post = (url,params) ->
    request('post',url,params)
  service.upload = upload

  service;