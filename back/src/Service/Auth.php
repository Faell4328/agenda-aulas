<?php

namespace App\Service;

use App\Tools\MongoDB;
use App\Tools\Cookie;

class Auth{
    public function logInUser($email, $password){
        $mongodb = new MongoDB();
        $user_information = null;
        $cookie = new Cookie();

        try{
            $user_information = $mongodb -> loginUser($email, $password);

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

        return ["status" => 200, "message" => "Logado com sucesso", "redirect" => "/", "data" => $user_information["role"]];
    }

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

    public function logOut($token){
        $cookie = new Cookie();

        try{
            $cookie -> deleteLoginToken($token);
        }
        catch(\Exception $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Deslogado", "redirect" => null, "data" => null];
    }
}

?>