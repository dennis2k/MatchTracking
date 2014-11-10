@HistoryBack = ($window) ->
  directive = {};

  directive.restrict = 'AE'
  directive.link = (scope, element, attr) ->
    element.on('click',() ->
      $window.history.back()
    )

  directive