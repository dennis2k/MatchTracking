<?php
$usersRoot = "users";
$usersCollection = $db->users;

$app->post("/auth/login",function() use ($app,$usersCollection) {

    $args = $app->request()->params();
    $username = Param::get($args,'_id');
    $password = Param::get($args,'password');

    $query['_id'] = new MongoRegex("/^" . $username . "/i");
    $doc = $usersCollection->findOne($query);
    if(empty($doc))
        return JSON::error('no user');
    if(!isset($doc['password']))
        return JSON::error('no password');
    $crypted = crypt($password,$doc['password']);
    if($crypted != $doc['password'])
        return JSON::error('wrong password');
    //INV: correct creds
    $doc['token'] = uniqid('', true);
    $doc['last_login'] = time();
    $usersCollection->update(array('_id' => $username),$doc);
    JSON::success($doc);
});


$app->get("/auth",function() use ($app,$usersCollection) {

    $args = $app->request()->params();
    $token = Param::get($args,'token');
    $username = Param::get($args,'user');
    if(is_null($token))
        return JSON::error('no token');
    if(is_null($username))
        return JSON::error('no user');

    $query = array('token' => $token, '_id' => $username);
//    $query['_id'] = new MongoRegex("/^" . $username . "/i");
    $doc = $usersCollection->findOne($query);

    if(!empty($doc))
        JSON::success($doc);
    else
        JSON::error('unauthorized');
});