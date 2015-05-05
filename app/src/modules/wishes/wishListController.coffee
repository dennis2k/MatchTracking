@WishListController = ($sce, wishList, WishService, TestService) ->
  vm = this

  vm.wishes = wishList.data;

  console.log(TestService);
  TestService.query();


  vm.trustAsUrl = (url) ->
    $sce.trustAsResourceUrl(url);

  vm.removeWish = (wish) ->
    WishService.delete(wish._id).then(() ->
      idx = vm.wishes.indexOf(wish)
      vm.wishes.splice(idx,1);
    )
  vm

WishListController.resolve = {
  wishList : (WishService) ->
    WishService.query()
}