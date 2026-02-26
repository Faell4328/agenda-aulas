<?php

declare(strict_types=1);

namespace App\Tools;

use App\Model\Token;
use App\Model\User;

class Cookie
{
    // Look up a token and return the associated user document or null
    public function findByToken(string $token){
        $tokenModel = new Token();
        $token_information = $tokenModel->findByToken($token);

        if (!$token_information) {
            return null;
        }

        if (isset($token_information['expiration_date']) && $token_information['expiration_date'] <= time()) {
            $tokenModel->deleteLoginToken($token);
            return null;
        }

        $userModel = new User();
        return $userModel->findById($token_information['user_id']);
    }

    public function getUserInformation(){
        if (!isset($_COOKIE['token'])) {
            return null;
        }

        return $this->findByToken($_COOKIE['token']);
    }

    public function createLoginToken($user_id): void{
        $tokenModel = new Token();
        $token = bin2hex(random_bytes(32));
        $expiration_date = strtotime('+30 days');

        $tokenModel->createLoginToken($user_id, $token, $expiration_date);

        $is_secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('token', $token, [
            'expires' => $expiration_date,
            'path' => '/',
            'secure' => $is_secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public function deleteLoginToken(string $token): void{
        $tokenModel = new Token();
        $tokenModel->deleteLoginToken($token);

        $is_secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('token', '', [
            'expires' => strtotime('-360 days'),
            'path' => '/',
            'secure' => $is_secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }
}