@AlertService = ($rootScope) ->
  service = {};

  alert = (prefix,type,message) ->
    send prefix type message
  error = (message) ->
    send('Error','alert-danger',message)
  info = (message) ->
    send('Info','alert-info',message)
  warning = (message) ->
    send('Warning','alert-warning',message)

  send = (prefix,type,message) ->
    $rootScope.$broadcast('alert',{prefix:prefix, class : type, message : message})

  service.error = error
  service.info = info
  service.warning = warning
  service.alert = alert
  service

AlertService.$inject = ['$rootScope'];
