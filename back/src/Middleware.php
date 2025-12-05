<?php

namespace App;

class Middleware{
    function routeWithLogin($user_information){
        if($user_information == null){
            new \App\Controller\SendingPattern(401, "Você deve estar logado para acessar essa rota", "/login");
            exit;
        }
    }

    function routeWithoutLogin($user_information){
        if($user_information !== null){
            new \App\Controller\SendingPattern(403, "Você não pode estar logado para acessar essa rota", "/");
            exit;
        }
    }

    function routeForStudentOnly($user_information){
        $this -> routeWithLogin($user_information);
        if($user_information -> role !== "student"){
            $status = ($user_information -> role == "off") ? 401 : 403;
            new \App\Controller\SendingPattern($status, "Você não é um aluno para acessar essa rota", "/");
            exit;
        }
    }

    function routeForTeachersOnly($user_information){
        $this -> routeWithLogin($user_information);
        if($user_information -> role !== "teacher"){
            $status = ($user_information -> role == "off") ? 401 : 403;
            new \App\Controller\SendingPattern($status, "Você não é um professor para acessar essa rota", "/");
            exit;
        }
    }
}