<?php

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

    public function createLoginToken($user_id){
        $tokenModel = new Token();
        $token = bin2hex(random_bytes(32));
        $expiration_date = strtotime('+30 days');
        $tokenModel->createLoginToken($user_id, $token, $expiration_date);
        // Not implemented as Only HTTP, because the project is simple.
        setcookie('token', $token, $expiration_date, '/', 'localhost', true, false);
    }

    public function deleteLoginToken($token){
        $tokenModel = new Token();
        $tokenModel->deleteLoginToken($token);
        $expiration_date = strtotime('-360 days');
        setcookie('token', '', $expiration_date, '/', 'localhost');
    }
}