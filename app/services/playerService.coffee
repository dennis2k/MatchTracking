@PlayerService = (CommonService) ->

  service = {};

  CommonService.configure('players');

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
