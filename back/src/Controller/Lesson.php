<?php

declare(strict_types=1);

namespace App\Controller;

use App\Tools\Validation;
use App\Tools\SendingPattern;
use App\Service\Lesson as LessonService;

class Lesson{
    private const MONTHS = [
        "janeiro" => "january",
        "fevereiro" => "february",
        "março" => "march",
        "abril" => "april",
        "maio" => "may",
        "junho" => "june",
        "julho" => "july",
        "agosto" => "august",
        "setembro" => "september",
        "outubro" => "october",
        "novembro" => "november",
        "dezembro" => "december",
    ];

    public function listLessons(): void{
        $months_of_number = array_keys(self::MONTHS);
        $current_month = self::MONTHS[$months_of_number[date('n') - 1]];

        $month_key = isset($_GET["month"]) ? strtolower((string) $_GET["month"]) : null;
        $month = ($month_key !== null && isset(self::MONTHS[$month_key])) ? self::MONTHS[$month_key] : $current_month;

        $service = new LessonService;
        $return_service = $service -> listLessons($month);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function listCreatedLessons($user_id): void{
        $service = new LessonService;
        $return_service = $service -> listCreatedLessons($user_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function listEnrolledLessons($user_id): void{
        $service = new LessonService;
        $return_service = $service -> listEnrolledLessons($user_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function createLesson(?object $req_body_json, $teacher_id): void{
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "timestamp");
        $validation -> fieldExists($req_body_json, "quantity");

        $service = new LessonService;
        $return_service = $service -> createLesson((string) $req_body_json->name, (int) $req_body_json->timestamp, (int) $req_body_json->quantity, $teacher_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function updateLesson(?object $req_body_json): void{
        $validation = new Validation;
        $validation -> queryExists("id");
        $lesson_id = (string) $_GET["id"];
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "timestamp");
        $validation -> fieldExists($req_body_json, "quantity");

        $service = new LessonService;
        $return_service = $service -> updateLesson($lesson_id, (string) $req_body_json->name, (int) $req_body_json->timestamp, (int) $req_body_json->quantity);
        
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function deleteLesson(): void{
        $validation = new Validation;
        $validation -> queryExists("id");
        $lesson_id = (string) $_GET["id"];

        $service = new LessonService;
        $return_service = $service -> deleteLesson($lesson_id);
        
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function joinLesson($user_information): void{
        $validation = new Validation;
        $validation -> queryExists("id");
        $lesson_id = (string) $_GET["id"];

        $user_id = $this->extractUserId($user_information);
        if ($user_id === null) {
            new SendingPattern(401, "Usuário não autenticado", "/login");
        }

        $service = new LessonService;
        $return_service = $service -> joinLesson($user_id, $lesson_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function leaveLesson($user_information): void{
        $validation = new Validation;
        $validation -> queryExists("id");
        $lesson_id = (string) $_GET["id"];

        $user_id = $this->extractUserId($user_information);
        if ($user_id === null) {
            new SendingPattern(401, "Usuário não autenticado", "/login");
        }

        $service = new LessonService;
        $return_service = $service -> leaveLesson($user_id, $lesson_id);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    private function extractUserId($user_information): ?string
    {
        if (is_array($user_information) && isset($user_information['_id'])) {
            return (string) $user_information['_id'];
        }

        if ($user_information instanceof \ArrayAccess && isset($user_information['_id'])) {
            return (string) $user_information['_id'];
        }

        if (is_object($user_information) && isset($user_information->_id)) {
            return (string) $user_information->_id;
        }

        return null;
    }
}
