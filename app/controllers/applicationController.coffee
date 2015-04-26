@ApplicationController = ($rootScope,AuthService,$location,localStorageService ) ->
  vm = this

  $rootScope.authenticated = null

  #Handles when user gets authenticated
  $rootScope.$on('authenticated',() ->
    $rootScope.authenticated = true
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