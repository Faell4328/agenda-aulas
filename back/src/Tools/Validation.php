<?php

namespace App\Tools;

class Validation{
    public function queryExists($query){
        if(!isset($_GET[$query])){
            new \App\Controller\SendingPattern(400, "Campo \"$query\" não enviado");
        }
        else if($_GET[$query] == ""){
            new \App\Controller\SendingPattern(400, "Campo \"$query\" está vazio");
        }
    }

    public function fieldExists($body_json, $name_field){
        if(!isset($body_json->$name_field)){
            new \App\Controller\SendingPattern(400, "Campo \"$name_field\" não enviados");
        }
        else if($body_json->$name_field == ""){
            new \App\Controller\SendingPattern(400, "Campo \"$name_field\" está vazio");
            exit;
        }
    }
}

?>