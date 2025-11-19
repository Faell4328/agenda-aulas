<?php

namespace App\Service;

use App\Tools\MongoDB;

class SignUp{
    public function registerUser($name, $role, $email, $password){
        $mongodb = new MongoDB();

        try{
            if($mongodb -> checkEmailExist($email) == false){
                $mongodb -> registerUser($name, $role, $email, $password);
            }
            else{
                throw new \Exception("Email já cadastrado");
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

        return ["status" => 200, "message" => "Cadastrado com sucesso", "redirect" => "/login", "data" => null];
    }
}

?>