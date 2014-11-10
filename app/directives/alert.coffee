@Alert = ($timeout) ->
  directive = {}
  directive.restrict = 'AE'
  directive.templateUrl = (ele, attrs) ->
    attrs.templateUrl || 'templates/alert.tpl.html'

  directive.link = (scope, element, attrs) ->
    scope.alert =
      class: ''
      message: ''
      show : false

    scope.timer = null;
    scope.delay = 10000;

    show = () ->
      scope.alert.show = true
      $timeout.cancel(scope.timer)
      scope.timer = $timeout ->
        scope.alert.show = false
      , scope.delay

    scope.$on('alert',(event, data) ->
      scope.alert = data;
      show();
    )

    scope.remove = () ->
      scope.alert =
        class : ''
        show : false
        message : ''

  directive

