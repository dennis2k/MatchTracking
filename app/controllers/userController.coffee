@UserController = ($filter,userList,UserService) ->
  vm = this

  vm.users = userList.data
  vm.newUser = {}
  save = (user) ->
    existing = $filter('filter')(vm.users,{_id : user._id})

    if existing.length == 0
      user.admin = true
      UserService.insert(user).then((result) ->
        vm.users.push(result.data) if result.status
      )
    else
      UserService.update({_id : user._id, doc : user} )

  remove = (user) ->
    UserService.delete(user._id).then(() ->
      idx = vm.users.indexOf(user)
      vm.users.splice(idx,1);
    )

  vm.save = save
  vm.remove = remove
  vm

UserController.resolve = {
  userList : (UserService) ->
    UserService.query()
}