@Utility = () ->
  service = {}

  guid = () ->

    _p8 = (s) ->
      p = (Math.random().toString(16)+"000000000").substr(2,8);
      if s
        "-" + p.substr(0,4) + "-" + p.substr(4,4)
      if !s
        p
    _p8() + _p8(true) + _p8(true) + _p8()

  service.guid = guid;
  service



