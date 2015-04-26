@AuthController = (AuthService) ->
  vm = this

  vm.authenticate = (creds) ->
    AuthService.authenticate(creds._id,creds.password)

  vm