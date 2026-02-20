<?php

namespace App\Model;

use MongoDB\Client;
use MongoDB\Database;
use MongoDB\BSON\ObjectId;

class BaseModel
{
    protected Client $client;
    protected Database $database;

    public function __construct(){
        $uri = 'mongodb://admin:senha123@mongo_db:27017';
        $dbName = 'agenda';

        $this->client = new Client($uri);
        $this->database = $this->client->selectDatabase($dbName);
    }

    protected function collection(string $name){
        return $this->database->selectCollection($name);
    }

    protected function toObjectId($id): ObjectId{
        if ($id instanceof ObjectId) {
            return $id;
        }

        return new ObjectId((string) $id);
    }
}
