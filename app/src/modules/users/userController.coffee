@UserController = ($filter,userList,UserService, ToasterService) ->
  vm = this

  vm.users = userList.data
  vm.newUser = {}
  save = (user) ->
    existing = $filter('filter')(vm.users,(u) -> u._id == user._id)

    if existing.length == 0
      UserService.insert(user).then((result) ->
        vm.users.push(result.data) if result.status
        ToasterService.info("User created!")
      )
    else
      UserService.update({_id : user._id, doc : user}).then((response) ->
        ToasterService.info("User updated!")
      )

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