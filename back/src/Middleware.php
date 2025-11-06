<?php

namespace App;

class Middleware{
    function routeWithLogin($user_information){
        if($user_information == null){
            echo "Você deve estar logado para acessar essa rota";
            exit;
        }
    }

    function routeWithoutLogin($user_information){
        if($user_information !== null){
            echo "Você não pode estar logado para acessar essa rota";
            exit;
        }
    }

    function routeForStudentOnly($user_information){
        $this -> routeWithLogin($user_information);
        if($user_information -> role !== "student"){
            echo "Você não é um aluno para acessar essa rota";
            exit;
        }
    }

    function routeForTeachersOnly($user_information){
        $this -> routeWithLogin($user_information);
        if($user_information -> role !== "teacher"){
            echo "Você não é um professor para acessar essa rota";
            exit;
        }
    }
}