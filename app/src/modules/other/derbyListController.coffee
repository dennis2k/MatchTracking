@DerbyListController = ($scope,DerbyService,ToasterService,Utility,guys,$rootScope,$location) ->
  vm = this

  vm.guys = guys.data

  vm.addComment = (comment, guy) ->
    comment.owner = $rootScope.user._id;
    DerbyService.addCommentToGuy(comment,guy).then(() ->
      guy.comments.push(angular.copy(comment))
      guy.comment = null
    )

  vm.selectGuy = (guy) ->
    $location.path('/other/derby/edit/' + guy._id.$id)

  vm.canEdit = (guy) ->
    if($rootScope.user.admin)
      return true;
    if(guy.owner == $rootScope.user._id)
      return true;
    return false;

  vm.delete = (derby) ->
    DerbyService.delete(derby._id.$id).then(() ->
      idx = vm.guys.indexOf(derby)
      vm.guys.splice(idx,1)
    )

  vm

DerbyListController.resolve = {
  guys : (DerbyService) ->
    DerbyService.query()

}