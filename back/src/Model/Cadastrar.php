<?php

namespace App\Model;

use App\Tools\MongoDB;

class Cadastrar{
    public function __construct(){
        $mongodb = new MongoDB();
        $mongodb -> registerUser($_POST["nome"], $_POST["email"], $_POST["senha"]);
    }
}

?>