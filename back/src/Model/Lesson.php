<?php

namespace App\Model;

use App\Tools\MongoDB;

class Lesson{
    public function createLesson(){
        $mongodb = new MongoDB();
        $mongodb -> createLesson($_POST["name"], $_POST["start_time"], $_POST["quantity"]);
    }
}

?>