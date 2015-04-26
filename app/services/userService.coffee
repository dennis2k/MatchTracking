@UserServiceWrapper = (BaseService) ->
  class UserService extends BaseService

    findUserByName : (name) ->
      @query({ doc : { _id : name, } })

  return new UserService('users')

