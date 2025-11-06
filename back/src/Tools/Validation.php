<?php

namespace App\Tools;

class Validation{
    public function queryString($query){
        if(!isset($_GET[$query])){
            new \App\Controller\SendingPattern(400, "Campo \"$query\" não enviado");
        }
        else if($_GET[$query] == ""){
            new \App\Controller\SendingPattern(400, "Campo \"$query\" está vazio");
        }
    }

    public function formInput($input){
        if(!isset($_POST[$input])){
            new \App\Controller\SendingPattern(400, "Campo \"$input\" não enviados");
        }
        else if($_POST[$input] == ""){
            new \App\Controller\SendingPattern(400, "Campo \"$input\" está vazio");
            exit;
        }
    }
}

?>