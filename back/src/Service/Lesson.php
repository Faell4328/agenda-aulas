<?php

namespace App\Service;

use App\Tools\MongoDB;

class Lesson{
    public function listAllLessons(){
        $mongodb = new MongoDB();
        return $mongodb -> listAllLessons();
    }

    public function listYourLessons(){
        $mongodb = new MongoDB();

        $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);
        return $mongodb -> listYourLessons($token_information["user_id"]);
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

        $mongodb -> updateLesson($_GET["id"], $_POST["name"], $timestamp_lessons_start, $timestamp_lessons_finish, $_POST["quantity"]);
    }

    public function joinLesson(){
        $mongodb = new MongoDB();

        $specificLesson = $mongodb -> listOfSpecificLessons($_GET["id"]);
        if(!$specificLesson){
            echo "Aula não encontrada";
            exit;
        }
        else if($specificLesson -> current_quantity >= $specificLesson -> max_quantity ){
            echo "Aula já está cheia";
            exit;
        }

        $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);
        if($mongodb -> checkIfYouAreAlreadyJoin($token_information["user_id"], $_GET["id"]) !== 0){
            echo "Já está ingressado na aula";
            exit;
        }

        $mongodb -> joinLesson($_GET["id"], $token_information["user_id"], $specificLesson -> current_quantity);
    }
}

?>