<?php

namespace App\Model;

use MongoDB\BSON\ObjectId;

class User extends BaseModel
{
    public function findById($id){
        $col = $this->collection('user');
        return $col->findOne(['_id' => $this->toObjectId($id)]);
    }

    public function emailExists(string $email): bool{
        $col = $this->collection('user');
        return ($col->countDocuments(['email' => $email]) > 0);
    }

    public function create(string $name, string $role, string $email, string $password): void{
        $col = $this->collection('user');
        // Not implemented hashpassword, because the project is simple.
        $col->insertOne([
            'name' => $name,
            'role' => $role,
            'email' => $email,
            'password' => $password,
        ]);
    }

    public function findByEmailAndPassword(string $email, string $password){
        $col = $this->collection('user');
        return $col->findOne(['email' => $email, 'password' => $password]);
    }

    public function getTeacherById($teacher_id) {
        return $this->findById($teacher_id);
    }
}
