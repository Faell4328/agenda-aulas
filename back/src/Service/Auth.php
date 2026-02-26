<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\User;
use App\Tools\Cookie;

class Auth{
    public function loginUser(string $email, string $password): array{
        $user_model = new User;
        $cookie = new Cookie;

        try{
            $user_information = $user_model -> findByEmailAndPassword($email, $password);

            if($user_information){
                $cookie -> createLoginToken($user_information["_id"]);
            }
            else{
                throw new \Exception("Email ou senha incorreto");
            }
        }
        catch(\Throwable $ex){
            if($ex->getMessage() === "Email ou senha incorreto"){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Logado com sucesso", "redirect" => "/", "data" => $user_information["role"]];
    }

    public function registerUser(string $name, string $role, string $email, string $password): array{
        $user_model = new User;

        try{
            if($user_model -> emailExists($email) == false){
                $user_model -> create($name, $role, $email, $password);
            }
            else{
                throw new \Exception("Email já cadastrado");
            }
        }
        catch(\Throwable $ex){
            if($ex->getMessage() === "Email já cadastrado"){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Cadastrado com sucesso", "redirect" => "/login", "data" => null];
    }

    public function logOut(string $token): array{
        $cookie = new Cookie;

        try{
            $cookie -> deleteLoginToken($token);
        }
        catch(\Throwable $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Deslogado", "redirect" => null, "data" => null];
    }
}

?>