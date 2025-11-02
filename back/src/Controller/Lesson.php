<?php

namespace App\Controller;

use App\Tools\Validation;

class Lesson{
    public function listAllLessons(){
        $lesson_service = new \App\Service\Lesson;
        $lessons = $lesson_service -> listAllLessons();

        foreach($lessons as $lesson){
            echo "ID: ".$lesson["_id"]."<br />";
            echo "Nome aula: ".$lesson["name"]."<br />";
            echo "Horário de início: ".$lesson["start_time"]."<br />";
            echo "Quantidade atual: ".$lesson["current_quantity"]."<br />";
            echo "Quantidade total: ".$lesson["max_quantity"]."<br />";
            echo "<hr />";
        }
    }

    public function createLesson(){
        $validation = new Validation;
        $validation -> inputForm("name");
        $validation -> inputForm("start_time");
        $validation -> inputForm("quantity");

        $lesson_service = new \App\Service\Lesson;
        $lesson_service -> createLesson();
    }

    public function updateLesson(){
        $validation = new Validation;
        $validation -> inputForm("id");
        $validation -> inputForm("name");
        $validation -> inputForm("start_time");
        $validation -> inputForm("quantity");

        $lesson_service = new \App\Service\Lesson;
        $lesson_service -> updateLesson();
    }
}