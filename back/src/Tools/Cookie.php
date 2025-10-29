<?php

namespace App\Tools;

use App\Tools\MongoDB;

class Cookie{
    public function checkValidityCookie(){
        if(!isset($_COOKIE["token"])){
            return false;
        }
        $mongodb = new MongoDB();
        $result = $mongodb -> checkValidityCookie($_COOKIE["token"]);

        if($result == false){
            return false;
        }
        else{
            if($result <= time()){
                return false;
            }
        }
        
        return true;
    }
}