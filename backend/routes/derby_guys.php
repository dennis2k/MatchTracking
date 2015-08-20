<?php
$eventCollection = $db->derby;
$service = new BaseCollectionService($app,$eventCollection);

$app->post("/derby/create",function() use ($app,$service) {
    $args = $app->request()->params();
    $doc = Param::get($args,'derby',array());
    $doc = json_decode($doc,true);
    $doc = $service->insert($doc);
    JSON::success($doc);
});

$app->post("/derby/update",function() use ($service) {
    $doc = $service->update();
    JSON::success($doc);
});

$app->get("/derby/query",function() use ($service) {
    $docs = $service->query();
    JSON::success($docs);
});
$app->post("/derby/remove",function() use ($service) {
    $service->remove();
    JSON::success();
});