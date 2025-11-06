<?php

namespace App\Tools;

class Validation{
    public function queryString($query){
        if(!isset($_GET[$query])){
            echo "Campo \"$query\" não enviado";
            exit;
        }
        else if($_GET[$query] == ""){
            echo "Campo \"$query\" está vazio";
            exit;
        }
    }

    public function formInput($input){
        if(!isset($_POST[$input])){
            echo "Campo \"$input\" não enviado";
            exit;
        }
        else if($_POST[$input] == ""){
            echo "Campo \"$input\" está vazio";
            exit;
        }
    }
}

?>