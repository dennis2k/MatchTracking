<?php
include_once __DIR__ . "/BaseCollectionService.php";

class UserService extends BaseCollectionService {
    public function update()
    {
        $args = $this->app->request()->params();
        $id = Param::get($args,'_id',false);
        $doc = Param::get($args,'doc',array());
        $doc = json_decode($doc,true);
        if(isset($doc['password']))
            $doc['password'] = Utility::encrypt($doc['password']);
        if(!$id)
            throw new Exception("Unable to update document, missing _id parameter");

        if($this->generatedId)
            $id = new MongoId($id);

        $this->collection->update(array('_id' => $id),$doc,array('upsert' => true));
        $newDoc = $this->collection->findOne(array('_id' => $id));
        return $newDoc;
    }
}