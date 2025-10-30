<?php

namespace App\Tools;

use App\Tools\MongoDB;

class Cookie{
    public function checkValidityCookie($return_cookie_data = false){
        if(!isset($_COOKIE["token"])){
            return false;
        }
        $mongodb = new MongoDB();
        $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);

        if($token_information == false){
            return false;
        }
        else{
            if($token_information->expiration_date <= time()){
                return false;
            }
        }
        
        if($return_cookie_data == false){
            return true;
        }
        else{
            return $token_information;
        }
    }

    public function checkTeacherCookie(){
        $token_information = $this->checkValidityCookie(true);
        $mongodb = new MongoDB();
        $userInformation = $mongodb -> userInformationWithCookie($token_information -> email_user);
        if($userInformation->role == "teacher"){
            return true;
        }
        else{
            return false;
        }
    }
}