<?php
$m = new MongoClient();

$db = $m->weather;

$collections = $db->data;

$cursor = $collections->findOne();

var_dump($cursor);


