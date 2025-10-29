<?php

namespace App;

class Middleware{
    function routeWithLogin(){
        if(!isset($_COOKIE["token"])){
            echo "Você deve estar logado para acessar essa rota";
            exit;
        }
    }
    function routeWithoutLogin(){
        if(isset($_COOKIE["token"])){
            echo "Você não pode estar logado para acessar essa rota";
            exit;
        }
    }
}