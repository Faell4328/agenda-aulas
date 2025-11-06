<?php

namespace App\Service;

use App\Tools\MongoDB;

class Lesson{
    public function listAllLessons(){
        $mongodb = new MongoDB();
        $data = [];
        
        try{
            $lessons = $mongodb -> listAllLessons();
            if($lessons){
                foreach($lessons as $lesson){
                    array_push($data, [
                        "id" => (string) $lesson["_id"],
                        "name" => $lesson["name"],
                        "start_time" => $lesson["start_time"],
                        "finish_time" => $lesson["finish_time"],
                        "current_quantity" => $lesson["current_quantity"],
                        "max_quantity" => $lesson["max_quantity"],
                    ]);
                }
            }
            else{
                $data = "Nenhuma aula cadastrada";
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function listYourLessons(){
        $mongodb = new MongoDB();
        $token_information = null;
        $data = [];

        
        try{
            $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);
            $yourLessons = $mongodb -> listYourLessons($token_information["user_id"]);
            if($yourLessons){
                foreach($yourLessons as $lesson){
                    array_push($data, [
                        "id" => (string) $lesson["id_lesson"],
                        "name" => $lesson["lessons"]["name"],
                        "start_time" => $lesson["lessons"]["start_time"],
                        "finish_time" => $lesson["lessons"]["finish_time"],
                        "current_quantity" => $lesson["lessons"]["current_quantity"],
                        "max_quantity" => $lesson["lessons"]["max_quantity"],
                    ]);
                }
            }
            else{
                $data = "Você não tem nenhuma aula ingressada";
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function createLesson(){
        $mongodb = new MongoDB();
        $timestamp_lessons_start = strtotime($_POST["date"]." ".$_POST["start_time"]);
        $timestamp_lessons_finish = strtotime("+ 50 minutes", $timestamp_lessons_start);
        
        try{
            $mongodb -> createLesson($_POST["name"], $timestamp_lessons_start, $timestamp_lessons_finish, $_POST["quantity"]);
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 201, "message" => "Aula cadastrada", "redirect" => null, "data" => null];
    }

    public function updateLesson(){
        $mongodb = new MongoDB();
        $timestamp_lessons_start = strtotime($_POST["date"]." ".$_POST["start_time"]);
        $timestamp_lessons_finish = strtotime("+ 50 minutes", $timestamp_lessons_start);

        try{
            if($mongodb -> checkLessonExist($_GET["id"]) == true){
                $mongodb -> updateLesson($_GET["id"], $_POST["name"], $timestamp_lessons_start, $timestamp_lessons_finish, $_POST["quantity"]);
            }
            else{
                throw new \Exception("Aula não existe");
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 200, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => "Aula atualizada", "redirect" => null, "data" => null];
    }

    public function joinLesson(){
        $mongodb = new MongoDB();

        try{
            $token_information = $mongodb -> checkValidityCookie($_COOKIE["token"]);
            if($mongodb -> checkIfYouAreAlreadyJoin($token_information["user_id"], $_GET["id"]) !== 0){
                throw new \Exception("Já está ingressado na aula");
            }

            if($mongodb -> checkLessonExist($_GET["id"]) == true){
                $specific_lesson = $mongodb -> listOfSpecificLessons($_GET["id"]);
                if($specific_lesson -> current_quantity >= $specific_lesson -> max_quantity ){
                    throw new \Exception("Aula já está cheia");
                }
            }
            else{
                throw new \Exception("Aula não encontrada");
            }

            $mongodb -> joinLesson($_GET["id"], $token_information["user_id"], $specific_lesson -> current_quantity);
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 201, "message" => "Ingressou na aula", "redirect" => null, "data" => null];

    }
}

?>