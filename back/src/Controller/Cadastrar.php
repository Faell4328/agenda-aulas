<?php

namespace App\Controller;

use App\Tools\Validation;

class Cadastrar{
    public function __construct(){
        $validation = new Validation;
        $validation -> inputForm("nome");
        $validation -> inputForm("email");
        $validation -> inputForm("senha");

        new \App\Model\Cadastrar();
    }
}

?>