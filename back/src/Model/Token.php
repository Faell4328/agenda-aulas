<?php

namespace App\Model;

class Token extends BaseModel
{
    public function createLoginToken($user_id, string $token, $expiration_date): void{
        $col = $this->collection('tokens');
        $col->insertOne([
            'token' => $token,
            'expiration_date' => $expiration_date,
            'user_id' => $this->toObjectId($user_id),
        ]);
    }

    public function deleteLoginToken(string $token): void{
        $col = $this->collection('tokens');
        $col->deleteOne(['token' => $token]);
    }

    public function findByToken(string $token){
        $col = $this->collection('tokens');
        return $col->findOne(['token' => $token]);
    }
}
