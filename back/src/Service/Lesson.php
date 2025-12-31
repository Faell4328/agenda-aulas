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
                        "timestamp_lesson_start" => $lesson["timestamp_lesson_start"],
                        "timestamp_lesson_finish" => $lesson["timestamp_lesson_finish"],
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

    public function listCreatedLessons($user_id){
        $mongodb = new MongoDB();
        $data = [];

        try{
            $your_lessons = $mongodb -> listCreatedLessons($user_id);

            foreach($your_lessons as $lesson){
                array_push($data, [
                    "id" => (string) $lesson["_id"],
                    "name" => $lesson["name"],
                    "timestamp_lesson_start" => $lesson["timestamp_lesson_start"],
                    "timestamp_lesson_finish" => $lesson["timestamp_lesson_finish"],
                    "current_quantity" => $lesson["current_quantity"],
                    "max_quantity" => $lesson["max_quantity"],
                ]);
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function listEnrolledLessons($user_id){
        $mongodb = new MongoDB();
        $data = [];

        try{
            $your_lessons = $mongodb -> listEnrolledLessons($user_id);

            foreach($your_lessons as $lesson){
                array_push($data, [
                    "id" => (string) $lesson["lessons"]["_id"],
                    "name" => $lesson["lessons"]["name"],
                    "timestamp_lesson_start" => $lesson["lessons"]["timestamp_lesson_start"],
                    "timestamp_lesson_finish" => $lesson["lessons"]["timestamp_lesson_finish"],
                    "current_quantity" => $lesson["lessons"]["current_quantity"],
                    "max_quantity" => $lesson["lessons"]["max_quantity"],
                ]);
            }
  
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function createLesson($name, $timestamp_lesson_start, $quantity, $teacher_id){
        $mongodb = new MongoDB();

        // adding 50 minutes to the current time
        $timestamp_lesson_finish = $timestamp_lesson_start+(3000*1000);

        try{
            $mongodb -> createLesson($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity, $teacher_id);
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 201, "message" => "Aula cadastrada", "redirect" => null, "data" => null];
    }

    public function updateLesson($name, $timestamp_lesson_start, $quantity){
        $mongodb = new MongoDB();

        $timestamp_lesson_finish = $timestamp_lesson_start+(3000*1000);

        try{
            if($mongodb -> checkLessonExist($_GET["id"]) == true){
                $mongodb -> updateLesson($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity);
            }
            else{
                throw new \Exception("Aula não existe");
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => "Aula atualizada", "redirect" => null, "data" => null];
    }

    public function deleteLesson(){
        $mongodb = new MongoDB();

        try{
            if($mongodb -> checkLessonExist($_GET["id"]) == true){
                $mongodb -> deleteLesson($_GET["id"]);
            }
            else{
                throw new \Exception("Aula não existe");
            }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 200, "message" => "Aula removida", "redirect" => null, "data" => null];
    }

    public function joinLesson($user_id){
        $mongodb = new MongoDB();

        try{
            if($mongodb -> checkIfYouAreAlreadyJoin($user_id, $_GET["id"]) !== 0){
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

            $mongodb -> joinLesson($_GET["id"], $user_id, $specific_lesson -> current_quantity);
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

    public function leaveLesson($user_id){
        $mongodb = new MongoDB();

        try{
            if($mongodb -> checkIfYouAreAlreadyJoin($user_id, $_GET["id"]) != 1){
                throw new \Exception("Não está ingressado na aula");
            }

            if($mongodb -> checkLessonExist($_GET["id"]) == true){
                $specific_lesson = $mongodb -> listOfSpecificLessons($_GET["id"]);
            }
            else{
                throw new \Exception("Aula não encontrada");
            }

            $mongodb -> leaveLesson($_GET["id"], $user_id, $specific_lesson -> current_quantity);
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }
            else{
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 202, "message" => "Saiu da aula", "redirect" => null, "data" => null];

    }
}

?>