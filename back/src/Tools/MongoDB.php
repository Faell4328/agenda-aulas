<?php

namespace App\Tools;

use MongoDB\Client;

class MongoDB{
    private $client;
    private $database;
    private $collection;

    public function __construct(){
        $this->client = new Client("mongodb://admin:senha123@mongo_db:27017");
        $this->database = $this->client->selectDatabase('agenda');
    }
    
    private function chooseCollection($collection){
        $this->collection = $this->database -> selectCollection($collection);
    }

    private function createLoginToken($email){
        $this -> chooseCollection("token");
        $token = bin2hex(random_bytes(32));
        $expiration_date = strtotime("+ 30 days");
        $this->collection -> insertOne(["token" => $token, "expiration_date" => $expiration_date, "email_user" => $email]);
        setcookie("token", $token, $expiration_date, "/");
    }

    public function checkValidityCookie($token){
        $this -> chooseCollection("token");
        $token_information = $this->collection -> findOne(["token" => $token]);
        if($token_information){
            return $token_information->expiration_date;
        }
        else{
            return false;
        }
    }

    public function registerUser($nome, $email, $senha){
        $this -> chooseCollection("user");
        $is_exist_user = $this->collection -> countDocuments(["email" => $email]);

        if($is_exist_user){
            echo "Email já sendo usado";
            exit;
        }

        $this->collection -> insertOne(["nome" => $nome, "email" => $email, "senha" => $senha]);
        echo "Usuário criado";
        exit;
    }

    public function loginUser($email, $senha){
        $this -> chooseCollection("user");
        $is_exist_email = $this->collection -> countDocuments(["email" => $email]);
        $is_exist_user = $this->collection -> countDocuments(["email" => $email, "senha" => $senha]);

        if($is_exist_user){
            $this->createLoginToken($email);
            echo "Logado";
            exit;
        }
        else if($is_exist_email && !$is_exist_user){
            echo "Senha incorreta";
            exit;
        }
        else{
            echo "Usuário não cadastrado";
            exit;
        }
    }
}

?>