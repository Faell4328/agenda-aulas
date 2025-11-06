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

    public function createLoginToken($user_id, $token, $expiration_date){
        $this -> chooseCollection("tokens");
        $this->collection -> insertOne(["token" => $token, "expiration_date" => $expiration_date, "user_id" => $user_id]);
    }

    public function checkValidityCookie($token){
        $this -> chooseCollection("tokens");
        $token_information = $this->collection -> findOne(["token" => $token]);
        if($token_information){
            return $token_information;
        }
        else{
            return false;
        }
    }

    public function userInformationWithCookie($user_id){
        $this -> chooseCollection("user");
        $user_id = new ObjectId($user_id);
        
        return $this->collection -> findOne(["_id" => $user_id]);
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
        $user_information = $this->collection -> findOne(["email" => $email, "password" => $password]);

        if($is_exist_email == 0){
            echo "Usuário não cadastrado";
            exit;
        }
        else if($is_exist_email && !$user_information){
            echo "Senha incorreta";
            exit;
        }

        return $user_information;
    }

    public function listOfSpecificLessons($id){
        $id = new ObjectId($_GET["id"]);

        $this -> chooseCollection("lessons");
        return $this->collection -> findOne(["_id" => $id]);
    }

    public function listAllLessons(){
        $this -> chooseCollection("lessons");
        $lessons = iterator_to_array($this->collection -> find());
        if(!empty($lessons)){
            return $lessons;
        }
        else{
            echo "Nenhuma aula cadastrada";
            exit;
        }
    }

    public function listYourLessons($user_id){
        $this -> chooseCollection("join_lesson");
        $list_your_lessons = iterator_to_array($this->collection -> aggregate([
            [
                '$match' => [
                    'id_student' => $user_id
                ]
            ],
            [
                '$lookup' => [
                    'from' => 'lessons',
                    'localField' => 'id_lesson',
                    'foreignField' => '_id',
                    'as' => 'lessons'
                ]
            ],
            [
                '$unwind' => '$lessons'
            ]
        ]));

        if(!$list_your_lessons){
            echo "Você não tem nenhuma aula ingressada";
            exit;
        }
        else{
            return $list_your_lessons;
        }
    }

    public function createLesson($name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $this -> chooseCollection("lessons");
        $this->collection -> insertOne(["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "current_quantity" => 0, "max_quantity" => (int) $quantity]);
        echo "Aula cadastrada";
        exit;
    }
    
    public function updateLesson($id, $name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $id = new ObjectId($_GET["id"]);

        $this -> chooseCollection("lessons");
        $this->collection -> updateOne(["_id" => $id], ['$set' => ["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "max_quantity" => (int) $quantity]]);
        echo "Aula atualizada";
        exit;
    }

    # ------------------------

    public function checkIfYouAreAlreadyJoin($user_id, $lesson_id){
        $this -> chooseCollection("join_lesson");
        
        $user_id = new ObjectId($user_id);
        $lesson_id = new ObjectId($lesson_id);
        return $this->collection -> countDocuments(["id_student" => $user_id, "id_lesson" => $lesson_id]);
    }
    
    public function joinLesson($id_lesson, $id_student, $current_quantity){
        $id_lesson = new ObjectId($id_lesson);
        $this -> chooseCollection("lessons");
        $this->collection -> updateOne(["_id" => $id_lesson], ['$set' => ["current_quantity" => (++$current_quantity)]]);

        $this -> chooseCollection("join_lesson");
        $this->collection -> insertOne(["id_student" => $id_student, "id_lesson" => $id_lesson]);
        echo "Ingressou na aula";
        exit;
    }
}

?>