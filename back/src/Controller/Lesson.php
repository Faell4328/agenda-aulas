<?php

namespace App\Controller;

use App\Tools\Validation;

class Lesson{
    public function listAllLessons(){
        $service = new \App\Service\Lesson;
        $return_service = $service -> listAllLessons();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function listYourLessons(){
        $service = new \App\Service\Lesson;
        $return_service = $service -> listYourLessons();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function createLesson($req_body_json){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "date");
        $validation -> fieldExists($req_body_json, "date");
        $validation -> fieldExists($req_body_json, "start_time");
        $validation -> fieldExists($req_body_json, "quantity");

        $service = new \App\Service\Lesson;
        $return_service = $service -> createLesson($req_body_json->name, $req_body_json->date, $req_body_json->start_time, $req_body_json->quantity);

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function updateLesson($req_body_json){
        $validation = new Validation;
        $validation -> queryExists($req_body_json, "id");
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "date");
        $validation -> fieldExists($req_body_json, "start_time");
        $validation -> fieldExists($req_body_json, "quantity");

        $service = new \App\Service\Lesson;
        $return_service = $service -> updateLesson($req_body_json->name, $req_body_json->date, $req_body_json->start_time, $req_body_json->quantity);
        
        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function joinLesson(){
        $validation = new Validation;
        $validation -> queryExists("id");

        $service = new \App\Service\Lesson;
        $return_service = $service -> joinLesson();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}