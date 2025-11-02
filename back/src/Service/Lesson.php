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
        $timestamp_lessons_start = strtotime($_POST["date"]." ".$_POST["start_time"]);
        $timestamp_lessons_finish = strtotime("+ 50 minutes", $timestamp_lessons_start);
        $mongodb -> createLesson($_POST["name"], $timestamp_lessons_start, $timestamp_lessons_finish, $_POST["quantity"]);
    }

    public function updateLesson(){
        $mongodb = new MongoDB();
        $timestamp_lessons_start = strtotime($_POST["date"]." ".$_POST["start_time"]);
        $timestamp_lessons_finish = strtotime("+ 50 minutes", $timestamp_lessons_start);
        $mongodb -> updateLesson($_POST["id"], $_POST["name"], $timestamp_lessons_start, $timestamp_lessons_finish, $_POST["quantity"]);
    }
}

?>