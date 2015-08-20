@ApplicationController = ($rootScope,AuthService,$location,localStorageService,toaster ) ->
  vm = this

  $rootScope.authenticated = null

  #Handles when user gets authenticated
  $rootScope.$on('authenticated',(event,data) ->
    $rootScope.authenticated = true
    $rootScope.user = data
    if($rootScope.user.admin)
      $rootScope.edit = true;
#    $rootScope.user.admin = true

    if(angular.isDefined($rootScope.initPath) && $rootScope.initPath != '/login')
      $location.path($rootScope.initPath)
    else
      $location.path('/events')
  )
  #Handles when users is unauthorized
  $rootScope.$on('unauthorized',() ->
    $rootScope.authenticated = false
    $location.path('/login')
  )

  #Handle authenticate check when route changes
  $rootScope.$on("$routeChangeStart", (event, next, current) ->

    if(next.requireAdmin == true)
      if(angular.isUndefined($rootScope.user) || $rootScope.user.admin != true)
        toaster.pop('warning','Restricted','Upps admins only sir !')
        console.log(current)
        $location.path(current.$$route.originalPath)

    if($rootScope.authenticated == false || $rootScope.authenticated == null)
      $location.path('/login')
  )

  #Check if user is authenticated when we bootstrap the application
  AuthService.isAuthenticated()

  vm.logout = () ->
    localStorageService.clearAll()
    $rootScope.authenticated = false
    $location.path('/login')


  vm