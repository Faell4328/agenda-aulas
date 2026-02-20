<?php

declare(strict_types=1);

namespace App;

use App\Tools\SendingPattern;

class Middleware
{
    private function ensureRole(?object $user_information, string $expectedRole, string $message): void
    {
        $this->routeWithLogin($user_information);

        $hasRole = property_exists($user_information, 'role') ? $user_information->role : null;
        if ($hasRole !== $expectedRole) {
            $status = ($hasRole === 'off') ? 401 : 403;
            new SendingPattern($status, $message, "/");
            exit;
        }
    }
    
    public function routeWithLogin(?object $user_information): void
    {
        if ($user_information === null) {
            new SendingPattern(401, "Você deve estar logado para acessar essa rota", "/login");
            exit;
        }
    }

    public function routeWithoutLogin(?object $user_information): void
    {
        if ($user_information !== null) {
            new SendingPattern(403, "Você não pode estar logado para acessar essa rota", "/");
            exit;
        }
    }

    public function routeForStudentOnly(?object $user_information): void
    {
        $this->ensureRole($user_information, 'student', 'Você não é um aluno para acessar essa rota');
    }

    public function routeForTeachersOnly(?object $user_information): void
    {
        $this->ensureRole($user_information, 'teacher', 'Você não é um professor para acessar essa rota');
    }
}