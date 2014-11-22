<?php
include_once __DIR__ . "/../core/FileUpload.class.php";
$wish = "wishe";
$wishCollection = $db->wish;


$app->post("/$wish/create",function() use ($app,$wishCollection) {

    $args = $app->request()->params();

    $name = Param::get($args,'name');
    $speech = Param::get($args,'speech',0);
    $video = Param::get($args,'video_url');
    $poster = Param::get($args,'poster');
    $price = Param::get($args,'price');

    $video = str_replace('watch?v=','embed/',$video);
    $wish = array('_id' => $name, 'name' => $name, 'speech' => $speech, 'video_url' => $video, 'votes' => array(), 'bought' => false, 'posted_by' => $poster, 'comments' => array(), 'price' => $price);

    try {
        $wishCollection->insert($wish);
        JSON::success($wish);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->post("/$wish/update",function() use ($app,$wishCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'_id',false);
    $doc = Param::get($args,'doc',array());
    $jsonDoc = json_decode($doc,true);
    if(!$id) {
        JSON::error("Unable to update document, missing _id parameter");
        die;
    }
    try {
        $wishCollection->update(array('_id' => new MongoId($id)),$jsonDoc,array('upsert' => true));
        $newDoc = $wishCollection->findOne(array('_id' => new MongoId($id)));
        JSON::success($newDoc);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->get("/$wish/query",function() use ($app,$wishCollection) {

    $args = $app->request()->params();
    $doc = Param::get($args,'doc',"");
    $query = json_decode($doc,true);
    if($query == "")
        $query = array();
    if(isset($query['_id']))
        $query['_id'] = new MongoRegex("/^" . $query['_id'] . "/i");
    $cursor = $wishCollection->find($query);
    $arr = iterator_to_array($cursor,false);
    JSON::success($arr);
});
$app->post("/$wish/remove",function() use ($app,$wishCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'id');
    try {
        $wishCollection->remove(array('_id' => $id));
        JSON::success();
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});
$app->post("/$wish/upload",function() use ($app) {

    if(!isset($_FILES))
        throw new Exception("Uploaded file not found");
    $file = array_pop($_FILES);
    $fileUpload = new FileUpload();
    $fileUpload->load($file);
    $fileUpload->move("/var/www/matchtracker/app/img");
    JSON::success($fileUpload->getPath());
});
