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

    public function createLesson(){
        $validation = new Validation;
        $validation -> formInput("name");
        $validation -> formInput("date");
        $validation -> formInput("start_time");
        $validation -> formInput("quantity");

        $service = new \App\Service\Lesson;
        $return_service = $service -> createLesson();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function updateLesson(){
        $validation = new Validation;
        $validation -> queryString("id");
        $validation -> formInput("name");
        $validation -> formInput("date");
        $validation -> formInput("start_time");
        $validation -> formInput("quantity");

        $service = new \App\Service\Lesson;
        $return_service = $service -> updateLesson();
        
        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function joinLesson(){
        $validation = new Validation;
        $validation -> queryString("id");

        $service = new \App\Service\Lesson;
        $return_service = $service -> joinLesson();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}