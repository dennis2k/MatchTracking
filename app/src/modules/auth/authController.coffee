@AuthController = (AuthService,UserService) ->
  vm = this

  vm.authenticate = (creds) ->
    AuthService.authenticate(creds._id,creds.password)

  vm.register = (user) ->
      UserService.insert(user).then((result) ->
        if(result.status == true)
          vm.authenticate(user)
       )

  vm