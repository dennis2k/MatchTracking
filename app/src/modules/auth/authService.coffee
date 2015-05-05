@AuthServiceWrapper = (localStorageService,$http,$q,$rootScope,$location,toaster) ->

  class AuthService

    authenticate : (username, password) ->
      deferred = $q.defer();
      $http({
            url : 'service.php/auth/login'
            method : 'POST'
            params : { _id : username, password: password}
            })
        .then((response) ->
               deferred.resolve(response)
               if(response.data.status == true)
                 localStorageService.set('user',username)
                 localStorageService.set('token',response.data.data.token)
                 $rootScope.$broadcast('authenticated',response.data.data)
                 toaster.pop('info','Info','Welcaaaam sir ' + username)
               else
                 toaster.pop('error','Error!','Wrong username or password')
                 $rootScope.$broadcast('unauthorized')
             ,
             (response) ->
               deferred.reject(response)
             )
      deferred.promise

    isAuthenticated : () ->
      token = localStorageService.get('token')
      user = localStorageService.get('user')
      deferred = $q.defer();
      $http({
            url : 'service.php/auth'
            method : 'GET'
            params : { token : token, user : user}
      })
      .then((response) ->
          deferred.resolve(response)
          if(response.data.status == true)
            $rootScope.$broadcast('authenticated',response.data.data)
          else
            $rootScope.$broadcast('unauthorized')
        ,
          (response) ->
            deferred.reject(response)
            $rootScope.$broadcast('unauthorized')
       )
      deferred.promise

  return new AuthService