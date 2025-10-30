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

    function routeForTeachersOnly(){
        $cookie = new Cookie;
        if(!($cookie->checkTeacherCookie())){
            echo "Você não é um professor para acessar essa rota";
            exit;
        }
    }
}