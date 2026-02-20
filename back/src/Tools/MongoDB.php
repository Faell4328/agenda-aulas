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

    public function deleteLoginToken($token){
        $this -> chooseCollection("tokens");
        $this->collection -> deleteOne(["token" => $token]);
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

    public function listOfSpecificLessons($lesson_id){
        $lesson_id = new ObjectId($lesson_id);

        $this -> chooseCollection("lessons");
        return $this->collection -> findOne(["_id" => $lesson_id]);
    }

    public function getTeacherOfLesson($teacher_id){
        $id = new ObjectId($teacher_id);

        $this -> chooseCollection("user");
        return $this->collection -> findOne(["_id" => $teacher_id]);
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
        return iterator_to_array($this->collection -> find([], ['sort' => ['timestamp_lesson_start' => 1, 'id' => 1]]));
    }

    public function listEnrolledStudents($lesson_id){
        $lesson_id = new ObjectId($lesson_id);

        $this -> chooseCollection("join_lesson");
            return iterator_to_array($this->collection -> aggregate([
                [
                    '$match' => [
                        'id_lesson' => $lesson_id
                    ]
                ],
                [
                    '$lookup' => [
                        'from' => 'user',
                        'localField' => 'id_student',
                        'foreignField' => '_id',
                        'as' => 'student'
                    ]
                ],
            ]));
    }

    public function listCreatedLessons($user_id){
        $this -> chooseCollection("lessons");
        return iterator_to_array($this -> collection -> find(['teacher_id' => ['$eq' => $user_id]]));
    }

    public function listEnrolledLessons($user_id){
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
            ],
            [
                '$sort' => [
                    'lessons.timestamp_lesson_start' => 1,
                    'lessons.id' => 1
                ]
            ]
        ]));
    }

    public function createLesson($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity, $teacher_id){
        $teacher_id = new ObjectId($teacher_id);

        $this -> chooseCollection("lessons");
        $this->collection -> insertOne(["name" => $name, "timestamp_lesson_start" => $timestamp_lesson_start, "timestamp_lesson_finish" => $timestamp_lesson_finish, "current_quantity" => 0, "max_quantity" => (int) $quantity, "teacher_id" => $teacher_id]);
    }
    
    public function updateLesson($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity){
        $id = new ObjectId($_GET["id"]);

        $return_lesson = $this -> listOfSpecificLessons($_GET["id"]);
        if($return_lesson["current_quantity"] > $quantity){
            throw new \Exception("A quantidade máxima não pode ser menor que a quantidade atual de alunos inscritos");
        }

        $this -> chooseCollection("lessons");
        $this->collection -> updateOne(["_id" => $id], ['$set' => ["name" => $name, "timestamp_lesson_start" => $timestamp_lesson_start, "timestamp_lesson_finish" => $timestamp_lesson_finish, "max_quantity" => (int) $quantity]]);
    }

    public function deleteLesson($id_lesson){
        $id = new ObjectId($_GET["id"]);

        $this -> chooseCollection("lessons");
        $this->collection -> deleteOne(["_id" => $id]);

        $this -> removeAllStudentsFromLesson($id_lesson);
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

    public function isJoinLesson($lesson_id, $student_id){
        $lesson_id = new ObjectId($lesson_id);
        $student_id= new ObjectId($student_id);
        $this -> chooseCollection("join_lesson");
        return ($this->collection -> countDocuments(["id_student" => $student_id, "id_lesson" => $lesson_id]) > 0) ? true : false;
    }

    public function leaveLesson($id_lesson, $id_student, $current_quantity){
        $id_lesson = new ObjectId($id_lesson);
        $this -> chooseCollection("lessons");
        $this->collection -> updateOne(["_id" => $id_lesson], ['$set' => ["current_quantity" => (--$current_quantity)]]);

        $this -> chooseCollection("join_lesson");
        $this->collection -> deleteOne(["id_student" => $id_student, "id_lesson" => $id_lesson]);
    }

    public function removeAllStudentsFromLesson($lesson_id){
        $lesson_id = new ObjectId($lesson_id);
        $this -> chooseCollection("join_lesson");
        $this->collection -> deleteMany(["id_lesson" => $lesson_id]);
    }
}

?>
