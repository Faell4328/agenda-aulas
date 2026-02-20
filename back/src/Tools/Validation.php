<?php

namespace App\Tools;

use App\Tools\SendingPattern;

class Validation{
    public function queryExists($query){
        if(!isset($_GET[$query])){
            new SendingPattern(400, "Campo \"$query\" não enviado");
        }
        else if($_GET[$query] == ""){
            new SendingPattern(400, "Campo \"$query\" está vazio");
        }

        exit;
    }

    public function fieldExists($body_json, $name_field){
        if(!isset($body_json->$name_field)){
            new SendingPattern(400, "Campo \"$name_field\" não enviados");
        }
        else if($body_json->$name_field == ""){
            new SendingPattern(400, "Campo \"$name_field\" está vazio");
        }

        exit;
    }
}

?>