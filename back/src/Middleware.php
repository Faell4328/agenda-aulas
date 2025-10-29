<?php

namespace App;

use App\Tools\Cookie;

class Middleware{
    function routeWithLogin(){
        $cookie = new Cookie;
        if(!$cookie->checkValidityCookie()){
            echo "Você deve estar logado para acessar essa rota";
            exit;
        }
    }
    function routeWithoutLogin(){
        $cookie = new Cookie;
        if($cookie->checkValidityCookie()){
            echo "Você não pode estar logado para acessar essa rota";
            exit;
        }
    }
}