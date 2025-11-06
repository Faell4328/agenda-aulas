<?php

namespace App\Service;

use App\Tools\MongoDB;
use App\Tools\Cookie;

class SignIn{
    public function logInUser(){
        $mongodb = new MongoDB();
        $user_information = null;
        $cookie = new Cookie();

        try{
            $user_information = $mongodb -> loginUser($_POST["email"], $_POST["password"]);

            if($user_information){
                $cookie -> createLoginToken($user_information["_id"]);
            }
            else{
                throw new \Exception("Email ou senha incorreto");
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => "Logado com sucesso", "redirect" => "/", "data" => null];
    }
}

?>