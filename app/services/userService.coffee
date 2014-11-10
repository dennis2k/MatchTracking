@UserService = (CommonService) ->

  service = {};

  CommonService.configure('users');

  list = () ->
    CommonService.query();
  insert = (params) ->
    CommonService.create(params);
  _delete = (id) ->
    CommonService.delete(id);

  service.list = list;
  service.insert = insert;
  service.delete = _delete
  service;
