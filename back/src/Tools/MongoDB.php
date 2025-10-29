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