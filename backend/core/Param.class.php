<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tue_desktop
 * Date: 26-03-14
 * Time: 22:55
 * To change this template use File | Settings | File Templates.
 */

class Param {

    public static function get($args, $key, $default = null) {
        if(!isset($args[$key]))
            return $default;
        if(isset($args[$key]))
            return $args[$key];
        if($args[$key] == false)
            return $args[$key];
        return $default;

    }

    public static function isEmpty($args,$key){
        if(!isset($args[$key]))
            return true;
        if($args[$key] == "")
            return true;
        if($args[$key] == null)
            return true;
        return false;
    }
}