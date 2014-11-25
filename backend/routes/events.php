<?php
$eventsRoot = "events";
$eventCollection = $db->events;


$app->post("/$eventsRoot/create",function() use ($app,$eventCollection) {

    $args = $app->request()->params();

    $name = Param::get($args,'name');
    $place = Param::get($args,'place');
    $start = Param::get($args,'start');
    $end = Param::get($args,'end');
    $event = array('name' => $name, 'place' => $place, 'start' => $start, 'end' => $end, 'players' => array(), 'matches' => array());

    try {
        $eventCollection->insert($event);
        JSON::success($event,"Event created!");
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->post("/$eventsRoot/update",function() use ($app,$eventCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'_id',false);
    $doc = Param::get($args,'doc',array());
    $jsonDoc = json_decode($doc,true);
    if(!$id) {
        JSON::error("Unable to update document, missing _id parameter");
        die;
    }
    try {
        $eventCollection->update(array('_id' => new MongoId($id)),$jsonDoc,array('upsert' => true));
        $newDoc = $eventCollection->findOne(array('_id' => new MongoId($id)));
        JSON::success($newDoc);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->get("/$eventsRoot/query",function() use ($app,$eventCollection) {

    $query = array();
    $args = $app->request()->params();

    $id = Param::get($args,'_id',null);
    if(!is_null($id))
        $query['_id'] = new MongoId($id);


    $cursor = $eventCollection->find($query);
    $arr = iterator_to_array($cursor,false);
    JSON::success($arr);
});
$app->post("/$eventsRoot/remove",function() use ($app,$eventCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'id');
    try {
        $eventCollection->remove(array('_id' => $id));
        JSON::success();
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});