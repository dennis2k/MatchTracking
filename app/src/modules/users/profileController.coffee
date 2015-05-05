@ProfileController = ($rootScope, UserService) ->
  vm = this
  vm.user = $rootScope.user
  console.log(vm.user,$rootScope.user)

ProfileController.resolve = {

}