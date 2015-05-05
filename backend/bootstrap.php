<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tue_desktop
 * Date: 03-10-14
 * Time: 00:09
 * To change this template use File | Settings | File Templates.
 */
include_once __DIR__ ."/vendor/autoload.php";
include_once __DIR__ . "/core/JSON.class.php";
include_once __DIR__ . "/core/Param.class.php";
include_once __DIR__ . "/core/Utility.class.php";
include_once __DIR__ . "/services/BaseCollectionService.php";

$app = new \Slim\Slim();
header('Content-Type: application/json');

/** Init database */
$m = new MongoClient();
$db = $m->matchtracker;

try {
    foreach (glob("../backend/routes/*.php") as $filename)
        include $filename;
}
catch(Exception $e)
{
    $app->response()->status(400);
    $app->response()->header('X-Status-Reason', $e->getMessage());
    JSON::error($e->getMessage());
}





try {
    $app->run();
}
catch(Exception $e) {
    $app->response()->status(400);
    $app->response()->header('X-Status-Reason', $e->getMessage());
    JSON::error($e->getMessage());
}
