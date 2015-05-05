<?php
include_once __DIR__ . "/../core/FileUpload.class.php";

$app->post("/upload/:context",function($context) {
    if(!isset($_FILES))
        throw new Exception("Uploaded file not found");
    foreach($_FILES as $file) {
        $fileUpload = new FileUpload($context);
        $fileUpload->load($file);
        $fileUpload->move(__DIR__ . "/../../app/asserts/img/" . $context . "/");
    }
    JSON::success($fileUpload->getPath());
});