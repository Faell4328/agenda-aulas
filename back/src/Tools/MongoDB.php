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

    public function checkEmailExist($email){
        $this -> chooseCollection("user");
        if($this->collection -> countDocuments(["email" => $email]) !== 0){
            return true;
        }
        else{
            return false;
        }
    }

    public function registerUser($name, $role, $email, $password){
        $this -> chooseCollection("user");
        $this->collection -> insertOne(["name" => $name, "role" => $role, "email" => $email, "password" => $password]);
    }

    public function loginUser($email, $password){
        $this -> chooseCollection("user");
        return $this->collection -> findOne(["email" => $email, "password" => $password]);
    }

    public function listOfSpecificLessons($id){
        $id = new ObjectId($_GET["id"]);

        $this -> chooseCollection("lessons");
        return $this->collection -> findOne(["_id" => $id]);
    }

    public function checkLessonExist($lesson_id){
        $lesson_id = new ObjectId($lesson_id);
        
        $this -> chooseCollection("lessons");
        if($this->collection -> countDocuments(["_id" => $lesson_id]) !== 0){
            return true;
        }
        else{
            return false;
        }
    }

    public function listAllLessons(){
        $this -> chooseCollection("lessons");
        return iterator_to_array($this->collection -> find());
    }

    public function listYourLessons($user_id){
        $this -> chooseCollection("join_lesson");
        return iterator_to_array($this->collection -> aggregate([
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
    }

    public function createLesson($name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $this -> chooseCollection("lessons");
        $this->collection -> insertOne(["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "current_quantity" => 0, "max_quantity" => (int) $quantity]);
    }
    
    public function updateLesson($id, $name, $timestamp_start_time, $timestamp_finish_time, $quantity){
        $id = new ObjectId($_GET["id"]);

        $this -> chooseCollection("lessons");
        $this->collection -> updateOne(["_id" => $id], ['$set' => ["name" => $name, "start_time" => $timestamp_start_time, "finish_time" => $timestamp_finish_time, "max_quantity" => (int) $quantity]]);
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
    }
}

?>