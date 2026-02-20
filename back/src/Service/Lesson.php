<?php

namespace App\Service;

use App\Model\Lesson as LessonModel;
use App\Model\JoinLesson as JoinLessonModel;
use App\Model\User as UserModel;

class Lesson{
    public function listLessons($lesson_id, $user_information){
        $lessonModel = new LessonModel();
        $joinLessonModel = new JoinLessonModel();
        $userModel = new UserModel();
        $data = [];

        try{
          if($lesson_id){
            if($user_information){
                $is_join_lesson = $joinLessonModel -> checkIfYouAreAlreadyJoin($user_information["_id"], $lesson_id);
            }
            else{
                $is_join_lesson = false;
            }
            $lesson = $lessonModel -> findById($lesson_id);

            if($lesson){
              $students = $lessonModel -> listEnrolledStudents($lesson_id);
              $listStudents =[];
              if($students){
                foreach($students as $student){
                  array_push($listStudents, $student["student"][0]["name"]);
                }
              }

              $teacher = $userModel -> getTeacherById($lesson["teacher_id"]);

              array_push($data, [
                  "id" => (string) $lesson["_id"],
                  "name" => $lesson["name"],
                  "timestamp_lesson_start" => $lesson["timestamp_lesson_start"],
                  "timestamp_lesson_finish" => $lesson["timestamp_lesson_finish"],
                  "current_quantity" => $lesson["current_quantity"],
                  "max_quantity" => $lesson["max_quantity"],
                  "teacher" => $teacher["name"],
                  "students" => $listStudents,
                  "is_join" => $is_join_lesson,
              ]);
            }
            else{
              throw new \Exception("Aula informada não foi encontrada");
            }
          }
          else{
            $lessons = $lessonModel -> listAll();
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
          }
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() == ""){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function listCreatedLessons($user_id){
        $lessonModel = new LessonModel();
        $data = [];

        try{
            $your_lessons = $lessonModel -> listCreatedLessons($user_id);

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
        $lessonModel = new LessonModel();
        $data = [];

        try{
            $your_lessons = $lessonModel -> listEnrolledLessons($user_id);

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
        $lessonModel = new LessonModel();

        // adding 50 minutes to the current time
        $timestamp_lesson_finish = $timestamp_lesson_start+(3000*1000);

        try{
            $lessonModel -> create($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity, $teacher_id);
        }
        catch(\Exception $ex){
            if($ex -> getPrevious() != ""){
                return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
            }
        }

        return ["status" => 201, "message" => "Aula cadastrada", "redirect" => null, "data" => null];
    }

    public function updateLesson($lesson_id, $name, $timestamp_lesson_start, $quantity){
        $lessonModel = new LessonModel();

        $timestamp_lesson_finish = $timestamp_lesson_start+(3000*1000);

        try{
            if($lessonModel -> exists($lesson_id) == true){
                $lessonModel -> update($lesson_id, $name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity);
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
        $lessonModel = new LessonModel();

        try{
            if($lessonModel -> exists($_GET["id"]) == true){
                $lessonModel -> delete($_GET["id"]);
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

        return ["status" => 200, "message" => "Aula removida", "redirect" => "/", "data" => null];
    }

    public function joinLesson($user_id){
        $joinModel = new JoinLessonModel();
        $lessonModel = new LessonModel();

        try{
            if($joinModel -> checkIfYouAreAlreadyJoin($user_id, $_GET["id"]) !== 0){
                throw new \Exception("Já está ingressado na aula");
            }

            if($lessonModel -> exists($_GET["id"]) == true){
                $specific_lesson = $lessonModel -> findById($_GET["id"]);
                if($specific_lesson['current_quantity'] >= $specific_lesson['max_quantity']){
                    throw new \Exception("Aula já está cheia");
                }
            }
            else{
                throw new \Exception("Aula não encontrada");
            }

            $joinModel -> joinLesson($_GET["id"], $user_id);
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
        $joinModel = new JoinLessonModel();
        $lessonModel = new LessonModel();

        try{
            if($joinModel -> checkIfYouAreAlreadyJoin($user_id, $_GET["id"]) == 0){
                throw new \Exception("Não está ingressado na aula");
            }

            if($lessonModel -> exists($_GET["id"]) == true){
                $specific_lesson = $lessonModel -> findById($_GET["id"]);
            }
            else{
                throw new \Exception("Aula não encontrada");
            }

            $joinModel -> leaveLesson($_GET["id"], $user_id);
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
