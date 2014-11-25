<?php
include_once __DIR__ . "/../core/FileUpload.class.php";
$gamesRoot = "games";
$gamesCollection = $db->games;


$app->post("/$gamesRoot/create",function() use ($app,$gamesCollection) {

    $args = $app->request()->params();

    $name = Param::get($args,'_id');
    $duration = Param::get($args,'duration',0);
    $url = Param::get($args,'image_url');
    $game = array('_id' => $name, 'duration' => $duration, 'image_url' => $url);

    try {
        $gamesCollection->insert($game);
        JSON::success($game);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->post("/$gamesRoot/update",function() use ($app,$gamesCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'_id',false);
    $doc = Param::get($args,'doc',array());
    $jsonDoc = json_decode($doc,true);
    if(!$id) {
        JSON::error("Unable to update document, missing _id parameter");
        die;
    }
    try {
        $gamesCollection->update(array('_id' => $id),$jsonDoc,array('upsert' => true));
        $newDoc = $gamesCollection->findOne(array('_id' => $id));
        JSON::success($newDoc);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->get("/$gamesRoot/query",function() use ($app,$gamesCollection) {

    $args = $app->request()->params();
    $doc = Param::get($args,'doc',"");
    $query = json_decode($doc,true);
    if($query == "")
        $query = array();
    if(isset($query['_id']))
        $query['_id'] = new MongoRegex("/^" . $query['_id'] . "/i");
    $cursor = $gamesCollection->find($query);
    $arr = iterator_to_array($cursor,false);
    JSON::success($arr);
});
$app->post("/$gamesRoot/remove",function() use ($app,$gamesCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'id');
    try {
        $gamesCollection->remove(array('_id' => $id));
        JSON::success();
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});
$app->post("/$gamesRoot/upload",function() use ($app) {

    if(!isset($_FILES))
        throw new Exception("Uploaded file not found");
    $file = array_pop($_FILES);
    $fileUpload = new FileUpload();
    $fileUpload->load($file);
    $fileUpload->move("/var/www/matchtracker/app/img");
    JSON::success($fileUpload->getPath());
});
