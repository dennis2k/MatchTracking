<?php
include_once __DIR__ . "/../core/FileUpload.class.php";
$gamesRoot = "cheat";

$app->get("/$gamesRoot/query",function() use ($app) {

    $args = $app->request()->params();
    $code = Param::get($args,'code');
    if($code == "iddqd")
        return JSON::success();
    JSON::error("Stop cheating, NEWB!");
});