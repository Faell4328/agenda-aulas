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
            echo "Horário de início: ".date("d-m-Y H:i", $lesson["start_time"])."<br />";
            echo "Horário de finalização: ".date("d-m-Y H:i", $lesson["finish_time"])."<br />";
            echo "Quantidade atual: ".$lesson["current_quantity"]."<br />";
            echo "Quantidade total: ".$lesson["max_quantity"]."<br />";
            echo "<hr />";
        }
    }

    public function createLesson(){
        $validation = new Validation;
        $validation -> formInput("name");
        $validation -> formInput("date");
        $validation -> formInput("start_time");
        $validation -> formInput("quantity");

        $lesson_service = new \App\Service\Lesson;
        $lesson_service -> createLesson();
    }

    public function updateLesson(){
        $validation = new Validation;
        $validation -> queryString("id");
        $validation -> formInput("name");
        $validation -> formInput("date");
        $validation -> formInput("start_time");
        $validation -> formInput("quantity");

        $lesson_service = new \App\Service\Lesson;
        $lesson_service -> updateLesson();
    }

    public function joinLesson(){
        $validation = new Validation;
        $validation -> queryString("id");

        $lesson_service = new \App\Service\Lesson;
        $lesson_service -> joinLesson();
    }
}