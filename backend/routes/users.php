<?php
$usersRoot = "users";
$usersCollection = $db->users;


$app->post("/$usersRoot/create",function() use ($app,$usersCollection) {

    $args = $app->request()->params();

    $username = Param::get($args,'_id');
    $password = Param::get($args,'password');
    $admin = Param::get($args,'admin',null);
    $user = array('_id' => $username, 'password' => Utility::encrypt($password));
    if($admin == true)
        $user['admin'] = true;

    try {
        $usersCollection->insert($user);
        JSON::success($user);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->post("/$usersRoot/update",function() use ($app,$usersCollection) {

    $args = $app->request()->params();

    $id = Param::get($args,'_id',false);
    $doc = Param::get($args,'doc',array());
    $jsonDoc = json_decode($doc,true);
    if(!$id) {
        JSON::error("Unable to update document, missing _id parameter");
        die;
    }
    try {
        $usersCollection->update(array('_id' => $id),$jsonDoc,array('upsert' => true));
        $newDoc = $usersCollection->findOne(array('_id' => $id));
        JSON::success($newDoc);
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});

$app->get("/$usersRoot/query",function() use ($app,$usersCollection) {

    $args = $app->request()->params();
    $doc = Param::get($args,'doc',"");
    $query = json_decode($doc,true);
    if($query == "")
        $query = array();
    if(isset($query['_id']))
        $query['_id'] = new MongoRegex("/^" . $query['_id'] . "/i");
    $cursor = $usersCollection->find($query);
    $arr = iterator_to_array($cursor,false);
    JSON::success($arr);
});
$app->post("/$usersRoot/remove",function() use ($app,$usersCollection) {

    $args = $app->request()->params();
    $id = Param::get($args,'id');
    try {
        $usersCollection->remove(array('_id' => $id));
        JSON::success();
    }
    catch(Exception $e) {
        JSON::error($e->getMessage());
    }
});
