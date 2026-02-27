<?php

declare(strict_types=1);

namespace App\Model;

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
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $col->insertOne([
            'name' => $name,
            'role' => $role,
            'email' => $email,
            'password' => $hashed_password,
        ]);
    }

    public function findByEmail(string $email){
        $col = $this->collection('user');
        return $col->findOne(['email' => $email]);
    }

    public function findByEmailAndPassword(string $email, string $password){
        $col = $this->collection('user');
        $user = $this->findByEmail($email);

        if (!$user || !isset($user['password'])) {
            return null;
        }

        $stored_password = (string) $user['password'];
        $is_plain_text_match = hash_equals($stored_password, $password);

        if (password_verify($password, $stored_password)) {
            return $user;
        }

        if ($is_plain_text_match) {
            $col->updateOne(
                ['_id' => $user['_id']],
                ['$set' => ['password' => password_hash($password, PASSWORD_DEFAULT)]]
            );
            return $user;
        }

        return null;
    }

    public function getTeacherById($teacher_id) {
        return $this->findById($teacher_id);
    }
}
