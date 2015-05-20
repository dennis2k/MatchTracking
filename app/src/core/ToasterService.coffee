@ToasterService = (toaster) ->
  service = {}

  service.info = (message) ->
    toaster.pop('info','Info',message)

  service.warning = (message) ->
    toaster.pop('warning','Warning!',message)

  service.error = (message) ->
    toaster.pop('error','Error!',message)

  service


