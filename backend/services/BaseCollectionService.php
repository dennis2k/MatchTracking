<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tue_desktop
 * Date: 27-04-15
 * Time: 00:09
 * To change this template use File | Settings | File Templates.
 */

class BaseCollectionService {

    protected $app,$collection, $generatedId;

    public function __construct($app, $collection,$generatedId = true)
    {
        $this->app = $app;
        $this->collection = $collection;
        $this->generatedId = $generatedId;
    }
    
    public function query()
    {
        $args = $this->app->request()->params();
        $id = Param::get($args,'_id');
        $query = Param::get($args,'query',"{}");
        $query = json_decode($query,true);
        if(!is_null($id))
            $query['_id'] = ($this->generatedId) ? new MongoId($id) : $id;

        $this->applyRules($query);
        $docs = $this->collection->find($query);
        $arr = iterator_to_array($docs,false);
        return $arr;
    }

    public function remove()
    {
        $args = $this->app->request()->params();
        $id = Param::get($args,'_id');
        $docs = $this->query();

        if(!$id)
            throw new Exception("Id not specified");
        if(count($docs) != 1)
            throw new Exception("Entity not found");

        $doc = $docs[0];
        $doc['delete_time'] = microtime();

        if($this->generatedId)
            $id = new MongoId($id);

        $this->collection->update(array('_id' => $id),$doc,array('upsert' => true));
        return true;
    }

    public function update(){
        $args = $this->app->request()->params();
        $id = Param::get($args,'_id',false);
        $doc = Param::get($args,'doc',array());
        $doc = json_decode($doc,true);
        if(!$id)
            throw new Exception("Unable to update document, missing _id parameter");

        if($this->generatedId)
            $id = new MongoId($id);

        $this->collection->update(array('_id' => $id),$doc,array('upsert' => true));
        $newDoc = $this->collection->findOne(array('_id' => $id));
        return $newDoc;
    }

    public function insert($doc)
    {
        if(!isset($doc['_id']))
            $doc['_id'] = null;
        $id = ($this->generatedId) ? new MongoId($doc['_id']) : $doc['_id'];
        $existing = $this->collection->findOne(array('_id' => $id));
        if(!empty($existing))
            throw new Exception("Duplicate entry!");
        $this->collection->insert($doc);
        return $doc;
    }

    public function applyRules(&$query)
    {
        $query['delete_time'] = array('$exists' => false);
    }
}