<?php

declare(strict_types=1);

namespace App\Model;
use App\Model\JoinLesson as JoinLessonModel;

class Lesson extends BaseModel
{
    public function findById($lesson_id){
        $col = $this->collection('lessons');
        return $col->findOne(['_id' => $this->toObjectId($lesson_id)]);
    }

    public function exists($lesson_id): bool{
        $col = $this->collection('lessons');
        return ($col->countDocuments(['_id' => $this->toObjectId($lesson_id)]) > 0);
    }

    public function listAll(int $timestamp_start_month, int $timestamp_end_month): array{
        $col = $this->collection('lessons');

        return iterator_to_array($col->aggregate([
            ['$match' => [
                'timestamp_lesson_start' => ['$gte' => $timestamp_start_month],
                'timestamp_lesson_finish' => ['$lte' => $timestamp_end_month]
            ]],
            ['$lookup' => [
                'from' => 'user',
                'localField' => 'teacher_id',
                'foreignField' => '_id',
                'as' => 'teacher'
            ]],
            ['$lookup' => [
                'from' => 'join_lesson',
                'localField' => '_id',
                'foreignField' => 'lesson_id',
                'as' => 'students'
            ]],
            ['$lookup' => [
                'from' => 'user',
                'localField' => 'students.id_student',
                'foreignField' => '_id',
                'as' => 'student_names'
            ]],
            ['$sort' => ['timestamp_lesson_start' => 1, 'id' => 1]]
        ]));
    }

    public function create(string $name, $timestamp_lesson_start, $timestamp_lesson_finish, int $quantity, $teacher_id): void{
        $col = $this->collection('lessons');
        $col->insertOne([
            'name' => $name,
            'timestamp_lesson_start' => $timestamp_lesson_start,
            'timestamp_lesson_finish' => $timestamp_lesson_finish,
            'current_quantity' => 0,
            'max_quantity' => $quantity,
            'teacher_id' => $this->toObjectId($teacher_id),
        ]);
    }

    public function update($lesson_id, string $name, $timestamp_lesson_start, $timestamp_lesson_finish, int $quantity): void{
        $col = $this->collection('lessons');
        $id = $this->toObjectId($lesson_id);

        $lesson = $this->findById($lesson_id);
        if ($lesson && isset($lesson['current_quantity']) && $lesson['current_quantity'] > $quantity) {
            throw new \Exception('A quantidade máxima não pode ser menor que a quantidade atual de alunos inscritos');
        }

        $col->updateOne(['_id' => $id], ['$set' => [
            'name' => $name,
            'timestamp_lesson_start' => $timestamp_lesson_start,
            'timestamp_lesson_finish' => $timestamp_lesson_finish,
            'max_quantity' => $quantity,
        ]]);
    }

    public function delete($lesson_id): void{
        $col = $this->collection('lessons');
        $col->deleteOne(['_id' => $this->toObjectId($lesson_id)]);
        // remove related join records
        $join = new JoinLessonModel();
        $join->removeAllStudentsFromLesson($lesson_id);
    }

    public function listCreatedLessons($user_id): array{
        $col = $this->collection('lessons');
        return iterator_to_array($col->find(['teacher_id' => $this->toObjectId($user_id)]));
    }

    public function listEnrolledStudents($lesson_id): array{
        $col = $this->collection('join_lesson');
        $lessonOid = $this->toObjectId($lesson_id);

        return iterator_to_array($col->aggregate([
            ['$match' => ['lesson_id' => $lessonOid]],
            ['$lookup' => [
                'from' => 'user',
                'localField' => 'id_student',
                'foreignField' => '_id',
                'as' => 'student'
            ]]
        ]));
    }

    public function listEnrolledLessons($user_id): array{
        $col = $this->collection('join_lesson');
        $studentOid = $this->toObjectId($user_id);

        return iterator_to_array($col->aggregate([
            ['$match' => ['id_student' => $studentOid]],
            ['$lookup' => [
                'from' => 'lessons',
                'localField' => 'lesson_id',
                'foreignField' => '_id',
                'as' => 'lessons'
            ]],
            ['$unwind' => '$lessons'],
            ['$sort' => ['lessons.timestamp_lesson_start' => 1, 'lessons.id' => 1]]
        ]));
    }
}
