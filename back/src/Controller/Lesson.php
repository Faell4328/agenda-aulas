<?php

namespace App\Controller;

use App\Tools\Validation;

class Lesson{
    public function createLesson(){
        $validation = new Validation;
        $validation -> inputForm("name");
        $validation -> inputForm("start_time");
        $validation -> inputForm("quantity");

        $login_service = new \App\Model\Lesson;
        $login_service -> createLesson();
    }
    public function updateLesson(){
    }
}