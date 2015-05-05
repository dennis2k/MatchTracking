<?php
$eventCollection = $db->events;
$service = new BaseCollectionService($app,$eventCollection);

$app->post("/events/create",function() use ($app,$service) {
    $args = $app->request()->params();
    $doc = Param::get($args,'event',array());
    $doc = json_decode($doc,true);
    $doc['matches'] = [];
    $doc = $service->insert($doc);
    JSON::success($doc);
});

$app->post("/events/update",function() use ($service) {
    $doc = $service->update();
    JSON::success($doc);
});

$app->get("/events/query",function() use ($service) {
    $docs = $service->query();
    JSON::success($docs);
});
$app->post("/events/remove",function() use ($service) {
    $service->remove();
    JSON::success();
});