<?php

namespace App\Tools;

use App\Tools\MongoDB;

class Cookie{
    public function getUserInformation(){
        $mongodb = new MongoDB();
        $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);

        if($token_information == false){
            return null;
        }
        else{
            if($token_information->expiration_date <= time()){
                return null;
            }
        }

        $user_information = $mongodb -> userInformationWithCookie($token_information -> email_user);
        
        return $user_information;
    }

    public function createLoginToken($email){
        $mongodb = new MongoDB();
        $token = bin2hex(random_bytes(32));
        $expiration_date = strtotime("+ 30 days");
        $mongodb -> createLoginToken($email, $token, $expiration_date);
        setcookie("token", $token, $expiration_date, "/");
    }
}