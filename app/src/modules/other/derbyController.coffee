@DerbyController = ($scope,DerbyService,ToasterService,Utility,$rootScope,guy,$location) ->
  vm = this
  vm.files = [];
  if(guy.data.length == 1)
    vm.derbyGuy = guy.data[0]
  else
    vm.derbyGuy = {};


  vm.save = (derby) ->
    if(derby._id)
      DerbyService.update({_id : derby._id.$id, doc : derby}).then(() ->
        ToasterService.info("Jockey updated")
        $location.path('/other/derby/list');
      )
    else
      derby.create_time = new Date().getTime()
      derby.comments = [];
      derby.owner = $rootScope.user._id
      DerbyService.insert({derby}).then((response) ->
        ToasterService.info("Jockey added")
        $location.path('/other/derby/list');
      )

  vm.delete = (derby) ->
    DerbyService.delete(derby._id.$id).then(() ->
      $location.path('/other/derby/list');
    )

  $scope.$watch('vm.files', (n,o) ->
    if(n != o && n != null && angular.isDefined(n))
      vm.upload(vm.files)
  )

  vm.canEdit = () ->
    if(!vm.derbyGuy._id)
      return true;
    if($rootScope.user.admin)
      return true;
    if(vm.derbyGuy.owner == $rootScope.user._id)
      return true;
    return false;

  vm.upload = (files) ->
    if (files && files.length)
      angular.forEach(files,(file) ->
        Utility.upload(file,'derby').then((response) ->
          vm.derbyGuy.image_url = response.data.data
      ))

  vm

DerbyController.resolve = {
  guy : ($location,DerbyService) ->
    parts = $location.$$url.split('/')
    if(parts[parts.length-1]) == "null"
      return { data : []}
    return DerbyService.query({_id : parts[parts.length-1]})

}