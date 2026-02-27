<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\Lesson as LessonModel;
use App\Model\JoinLesson as JoinLessonModel;

class Lesson{
    private const LESSON_DURATION_MS = 3000000;

    public function listLessons(string $month): array{
        $timestamp_start_month = strtotime("first day of $month this year 00:00:00", time())*1000;
        $timestamp_end_month = strtotime("last day of $month this year 23:59:59", time())*1000;


        $lessonModel = new LessonModel;

        try{
            $lessons = $lessonModel -> listAll($timestamp_start_month, $timestamp_end_month);

            $data = [];
            foreach($lessons as $lesson){

                $studentsArray = $lesson["student_names"]->getArrayCopy();

                array_push($data, [
                    "id" => (string) $lesson["_id"],
                    "name" => $lesson["name"],
                    "timestamp_lesson_start" => $lesson["timestamp_lesson_start"],
                    "timestamp_lesson_finish" => $lesson["timestamp_lesson_finish"],
                    "current_quantity" => $lesson["current_quantity"],
                    "max_quantity" => $lesson["max_quantity"],
                    "teacher" => $lesson["teacher"][0]["name"],
                    "students" => array_map(function ($student) {
                        return $student["name"];
                    }, $studentsArray),
                ]);
            }
        }
        catch(\Throwable $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function listCreatedLessons($user_id): array{
        $lessonModel = new LessonModel;
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
        catch(\Throwable $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function listEnrolledLessons($user_id): array{
        $lessonModel = new LessonModel;
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
        catch(\Throwable $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => null, "redirect" => null, "data" => $data];
    }

    public function createLesson(string $name, int $timestamp_lesson_start, int $quantity, $teacher_id): array{
        $lessonModel = new LessonModel;

        if ($quantity <= 0) {
            return ["status" => 400, "message" => "Quantidade máxima deve ser maior que zero", "redirect" => null, "data" => null];
        }

        $timestamp_lesson_finish = $timestamp_lesson_start + self::LESSON_DURATION_MS;

        try{
            $lessonModel -> create($name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity, $teacher_id);
        }
        catch(\Throwable $ex){
            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 201, "message" => "Aula cadastrada", "redirect" => null, "data" => null];
    }

    public function updateLesson($user_information, $lesson_id, string $name, int $timestamp_lesson_start, int $quantity): array{
        $lessonModel = new LessonModel;

        if ($quantity <= 0) {
            return ["status" => 400, "message" => "Quantidade máxima deve ser maior que zero", "redirect" => null, "data" => null];
        }

        $timestamp_lesson_finish = $timestamp_lesson_start + self::LESSON_DURATION_MS;

        try{
            if($lessonModel -> exists($lesson_id) == true){
                $lessonSpecific = $lessonModel -> findById($lesson_id);
                if($lessonSpecific["teacher_id"] != $user_information["_id"]){
                    return ["status" => 403, "message" => "Não tem permissão para atualizar esta aula", "redirect" => null, "data" => null];
                }

                $lessonModel -> update($lesson_id, $name, $timestamp_lesson_start, $timestamp_lesson_finish, $quantity);
            }
            else{
                throw new \Exception("Aula não existe");
            }
        }
        catch(\Throwable $ex){
            if($ex -> getMessage() === "Aula não existe" || $ex -> getMessage() === 'A quantidade máxima não pode ser menor que a quantidade atual de alunos inscritos' || $ex -> getMessage() === "Não tem permissão para atualizar esta aula"){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Aula atualizada", "redirect" => null, "data" => null];
    }

    public function deleteLesson($user_information, $lesson_id): array{
        $lessonModel = new LessonModel;

        try{
            if($lessonModel -> exists($lesson_id) == true){
                $lessonSpecific = $lessonModel -> findById($lesson_id);
                if($lessonSpecific["teacher_id"] != $user_information["_id"]){
                    return ["status" => 403, "message" => "Não tem permissão para atualizar esta aula", "redirect" => null, "data" => null];
                }

                $lessonModel -> delete($lesson_id);
            }
            else{
                throw new \Exception("Aula não existe");
            }
        }
        catch(\Throwable $ex){
            if($ex -> getMessage() === "Aula não existe" || $ex -> getMessage() === "Não tem permissão para atualizar esta aula"){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 200, "message" => "Aula removida", "redirect" => "/", "data" => null];
    }

    public function joinLesson($user_id, $lesson_id): array{
        $joinModel = new JoinLessonModel;
        $lessonModel = new LessonModel;

        try{
            if($joinModel -> checkIfYouAreAlreadyJoin($user_id, $lesson_id) !== 0){
                throw new \Exception("Já está ingressado na aula");
            }

            if($lessonModel -> exists($lesson_id) == true){
                $specific_lesson = $lessonModel -> findById($lesson_id);

                if($specific_lesson["timestamp_lesson_start"] < time()*1000){
                    throw new \Exception("O prazo para ingressar na aula já passou");
                }
                else if($specific_lesson['current_quantity'] >= $specific_lesson['max_quantity']){
                    throw new \Exception("Aula já está cheia");
                }
            }
            else{
                throw new \Exception("Aula não encontrada");
            }

            $joinModel -> joinLesson($lesson_id, $user_id);
        }
        catch(\Throwable $ex){
            if(in_array($ex -> getMessage(), ["Já está ingressado na aula", "Aula já está cheia", "Aula não encontrada", "O prazo para ingressar na aula já passou"], true)){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 201, "message" => "Ingressou na aula", "redirect" => null, "data" => null];

    }

    public function leaveLesson($user_id, $lesson_id): array{
        $joinModel = new JoinLessonModel;
        $lessonModel = new LessonModel;

        try{
            if($joinModel -> checkIfYouAreAlreadyJoin($user_id, $lesson_id) == 0){
                throw new \Exception("Não está ingressado na aula");
            }

            if($lessonModel -> exists($lesson_id) != true){
                throw new \Exception("Aula não encontrada");
            }
            
            $specific_lesson = $lessonModel -> findById($lesson_id);
            if($specific_lesson["timestamp_lesson_start"] < time()*1000){
                throw new \Exception("Não é possível desingressar da aula");
            }

            $joinModel -> leaveLesson($lesson_id, $user_id);
        }
        catch(\Throwable $ex){
            if(in_array($ex -> getMessage(), ["Não está ingressado na aula", "Aula não encontrada", "Não é possível desingressar da aula"], true)){
                return ["status" => 400, "message" => $ex -> getMessage(), "redirect" => null, "data" => null];
            }

            return ["status" => 500, "message" => "Ocorreu um erro interno", "redirect" => null, "data" => null];
        }

        return ["status" => 202, "message" => "Saiu da aula", "redirect" => null, "data" => null];

    }
}

?>
