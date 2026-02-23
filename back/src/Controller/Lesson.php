<?php

namespace App\Controller;

use App\Tools\Validation;
use App\Tools\SendingPattern;
use App\Service\Lesson as LessonService;

class Lesson{
    public function listLessons($user_information){
        $validation = new Validation;

        $months_of_number = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        $months = ["janeiro" => "january", "fevereiro" => "february", "março" => "march", "abril" => "april", "maio" => "may", "junho" => "june", "julho" => "july", "agosto" => "august", "setembro" => "september", "outubro" => "october", "novembro" => "november", "dezembro" => "december"];
        $current_month = $months[$months_of_number[date('n') - 1]];

        $month = (isset($_GET["month"]) && isset($months[$_GET["month"]])) ? $_GET["month"] : $current_month;

        $service = new LessonService;
        $return_service = $service -> listLessons($month, $user_information);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function listCreatedLessons($user_id){
        $service = new LessonService;
        $return_service = $service -> listCreatedLessons($user_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function listEnrolledLessons($user_id){
        $service = new LessonService;
        $return_service = $service -> listEnrolledLessons($user_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function createLesson($req_body_json, $teacher_id){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "timestamp");
        $validation -> fieldExists($req_body_json, "quantity");

        $service = new LessonService;
        $return_service = $service -> createLesson($req_body_json->name, $req_body_json->timestamp, $req_body_json->quantity, $teacher_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function updateLesson($req_body_json){
        $validation = new Validation;
        $validation -> queryExists("id");
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "timestamp");
        $validation -> fieldExists($req_body_json, "quantity");

        $lesson_id = $_GET["id"];

        $service = new LessonService;
        $return_service = $service -> updateLesson($lesson_id, $req_body_json->name, $req_body_json->timestamp, $req_body_json->quantity);
        
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function deleteLesson(){
        $validation = new Validation;
        $validation -> queryExists("id");

        $service = new LessonService;
        $return_service = $service -> deleteLesson($_GET["id"]);
        
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function joinLesson($user_information){
        $validation = new Validation;
        $validation -> queryExists("id");

        $service = new LessonService;
        $return_service = $service -> joinLesson($user_information["_id"]);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function leaveLesson($user_information){
        $validation = new Validation;
        $validation -> queryExists("id");

        $service = new LessonService;
        $return_service = $service -> leaveLesson($user_information["_id"]);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}
