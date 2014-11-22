@CreateWishController = ($location, WishService) ->
  vm = this

  vm.saveWish = (wish) ->
    WishService.insert(wish).then(() ->
      $location.path('/wishlist');
    )
  vm