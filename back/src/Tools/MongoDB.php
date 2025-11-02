<?php

namespace App\Tools;

use MongoDB\Client;
use MongoDB\BSON\ObjectId;

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
            return $token_information;
        }
        else{
            return false;
        }
    }

    public function registerUser($name, $role, $email, $password){
        $this -> chooseCollection("user");
        $is_exist_user = $this->collection -> countDocuments(["email" => $email]);

        if($is_exist_user){
            echo "Email já sendo usado";
            exit;
        }

        $this->collection -> insertOne(["name" => $name, "role" => $role, "email" => $email, "password" => $password]);
        echo "Usuário criado";
        exit;
    }

    public function loginUser($email, $password){
        $this -> chooseCollection("user");
        $is_exist_email = $this->collection -> countDocuments(["email" => $email]);
        $is_exist_user = $this->collection -> countDocuments(["email" => $email, "password" => $password]);

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

    public function userInformationWithCookie($email){
        $this -> chooseCollection("user");
        return $this->collection -> findOne(["email" => $email]);
    }

    public function listOfSpecificLessons($id){
        $id = new ObjectId($_POST["id"]);

        $this -> chooseCollection("aula");
        return $this->collection -> findOne(["_id" => $id]);
    }

    public function listAllLessons(){
        $this -> chooseCollection("aula");
        $lessons = iterator_to_array($this->collection -> find());
        if(!empty($lessons)){
            return $lessons;
        }
        else{
            echo "Nenhuma aula criada";
            exit;
        }
    }

    public function createLesson($name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $this -> chooseCollection("aula");
        $this->collection -> insertOne(["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "current_quantity" => 0, "max_quantity" => (int) $quantity]);
        echo "Aula cadastrada";
        exit;
    }
    
    public function updateLesson($id, $name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $id = new ObjectId($_POST["id"]);

        $this -> chooseCollection("aula");
        $this->collection -> updateOne(["_id" => $id], ['$set' => ["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "max_quantity" => (int) $quantity]]);
        echo "Aula atualizada";
        exit;
    }

    # ------------------------

    public function checkIfYouAreAlreadyJoin($id_user){
        $this -> chooseCollection("inscricoes");
        return $this->collection -> countDocuments(["id_student" => $id_user]);
    }
    
    public function joinLesson($id_lesson, $id_student, $current_quantity){
        $this -> chooseCollection("aula");
        $this->collection -> updateOne(["_id" => $id_lesson], ['$set' => ["current_quantity" => ($current_quantity + 1)]]);

        $this -> chooseCollection("inscricoes");
        $this->collection -> insertOne(["id_lesson" => $id_lesson, "id_student" => $id_student]);
        echo "Ingressou na aula";
        exit;
    }
}

?>