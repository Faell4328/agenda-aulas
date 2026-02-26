<?php

declare(strict_types=1);

namespace App\Tools;

use App\Tools\SendingPattern;

class Validation{
    public function queryExists(string $query): string{
        if(!isset($_GET[$query])){
            new SendingPattern(400, "Campo \"$query\" não enviado");
        }

        $value = trim((string) $_GET[$query]);
        if($value === ""){
            new SendingPattern(400, "Campo \"$query\" está vazio");
        }

        return $value;
    }

    public function fieldExists(?object $body_json, string $name_field)
    {
        if($body_json === null || !isset($body_json->$name_field)){
            new SendingPattern(400, "Campo \"$name_field\" não enviado");
        }

        if(is_string($body_json->$name_field) && trim($body_json->$name_field) === ""){
            new SendingPattern(400, "Campo \"$name_field\" está vazio");
        }

        return $body_json->$name_field;
    }
}

?>