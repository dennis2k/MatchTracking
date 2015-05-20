<?php
include_once __DIR__ . "/../services/UserService.php";
$service = new UserService($app,$db->users,false);
$app->post("/users/create",function() use ($app,$service) {

    $args = $app->request()->params();
    $username = Param::get($args,'_id');
    $password = Param::get($args,'password');
    $admin = Param::get($args,'admin',null);
    $user = array('_id' => $username, 'password' => Utility::encrypt($password));
    if($admin == true)
        $user['admin'] = true;
    $doc = $service->insert($user);
    unset($doc['password']);
    JSON::success($doc);

});
$app->post("/users/update",function() use ($service) {
    $doc = $service->update();
    unset($doc['password']);
    JSON::success($doc);
});

$app->get("/users/query",function() use ($service) {
    $docs = $service->query();
    foreach ($docs as &$doc) {
        unset($doc['password']);
    }
    JSON::success($docs);
});
$app->post("/users/remove",function() use ($service) {
    $service->remove();
    JSON::success();
});