<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tue_desktop
 * Date: 25-04-15
 * Time: 00:41
 * To change this template use File | Settings | File Templates.
 */

class Utility {
    public static function encrypt($password)
    {
        $salt = uniqid('', true);
        $algo = '6'; // CRYPT_SHA512
        $rounds = '5042';
        $cryptSalt = '$'.$algo.'$rounds='.$rounds.'$'.$salt;

        $hash = crypt($password, $cryptSalt);
        return $hash;
    }
}