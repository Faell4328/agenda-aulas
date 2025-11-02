<?php

namespace App\Service;

use App\Tools\MongoDB;

class Lesson{
    public function listAllLessons(){
        $mongodb = new MongoDB();
        return $mongodb -> listAllLessons();
    }

    public function createLesson(){
        $mongodb = new MongoDB();
        $mongodb -> createLesson($_POST["name"], $_POST["start_time"], $_POST["quantity"]);
    }

    public function updateLesson(){
        $mongodb = new MongoDB();
        $mongodb -> updateLesson($_POST["id"], $_POST["name"], $_POST["start_time"], $_POST["quantity"]);
    }
}

?>