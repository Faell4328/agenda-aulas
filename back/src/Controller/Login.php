<?php

namespace App\Controller;

use App\Tools\Validation;

class Login{
    public function __construct(){
        $validation = new Validation;
        $validation -> inputForm("email");
        $validation -> inputForm("senha");

        new \App\Model\Login();
    }
}

?>