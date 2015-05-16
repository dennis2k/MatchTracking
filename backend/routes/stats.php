<?php
include_once __DIR__ . "/../services/StatsService.php";
$service = new StatsService($db);

$app->get("/stats/versus",function() use ($app,$service) {

    $args = $app->request()->params();
    $player1 = Param::get($args,'player1');
    $player2 = Param::get($args,'player2');
    $game = Param::get($args,'game');

    $service->versus($player1,$player2);

});