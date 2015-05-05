<?php
include_once __DIR__ . "/../core/FileUpload.class.php";

$service = new BaseCollectionService($app,$db->games,false);
$app->post("/games/create",function() use ($app,$service) {

    $args = $app->request()->params();

    $name = Param::get($args,'_id');
    $duration = Param::get($args,'duration',0);
    $url = Param::get($args,'image_url');
    $game = array('_id' => $name, 'duration' => $duration, 'image_url' => $url);
    $doc = $service->insert($game);
    JSON::success($doc);
});

$app->post("/games/update",function() use ($service) {
    $doc = $service->update();
    JSON::success($doc);
});

$app->get("/games/query",function() use ($service) {
    $docs = $service->query();
    JSON::success($docs);
});
$app->post("/games/remove",function() use ($service) {
    $service->remove();
    JSON::success();
});
$app->post("/games/upload",function() {
    if(!isset($_FILES))
        throw new Exception("Uploaded file not found");
    $file = array_pop($_FILES);
    $fileUpload = new FileUpload();
    $fileUpload->load($file);
    $fileUpload->move("/var/www/matchtracker/app/img");
    JSON::success($fileUpload->getPath());
});
