@ProfileController = ($scope,$rootScope, user, UserService, Utility) ->
  vm = this
  vm.user = user.data[0]

  vm.is_self = ($rootScope.user._id == vm.user._id)

  vm.getAvatar = (user) ->
    if(angular.isDefined(user.image_url))
      return user.image_url
    return "asserts/img/user/default_user.jpg"

  vm.upload = (files) ->
    vm.user.images = [] if angular.isUndefined(vm.user.images)
    if (files && files.length)
      angular.forEach(files,(file) ->
        Utility.upload(file,'user').then((response) ->
          vm.user.image_url = response.data.data
          UserService.update({_id : vm.user._id, doc : vm.user})
  ))
  $scope.$watch('vm.files', (n,o) ->
   if(n != o && n != null && angular.isDefined(n))
     vm.upload(vm.files)
  )
  vm


ProfileController.resolve = {
  user : ($location,UserService) ->
    parts = $location.$$url.split('/')
    UserService.query({_id : parts[2]})
}