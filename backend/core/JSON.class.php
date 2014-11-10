<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tue_desktop
 * Date: 27-05-13
 * Time: 23:49
 * To change this template use File | Settings | File Templates.
 */

class JSON {

    public static function error($message)
    {
        echo json_encode(array('status' => false,'message' => $message, 'data' => array()));
    }
    public static function success($data = array(),$message = '')
    {
        echo json_encode(array('status' => true,'message' => $message, 'data' => $data));
    }
}