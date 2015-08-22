@DerbyServiceWrapper = (BaseService) ->
  class DerbyService extends BaseService

    addCommentToGuy : (comment,guy) ->
      comment.create_time = new Date().getTime()/1000;
      @update( {_id : guy._id.$id, doc : { $push : { comments : comment } }} )


  return new DerbyService('derby')

