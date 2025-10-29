<?php

namespace App\Tools;

class Validation{
    public function inputForm($input){
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