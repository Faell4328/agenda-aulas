<?php

namespace App\Model;

class JoinLesson extends BaseModel
{
    public function checkIfYouAreAlreadyJoin($user_id, $lesson_id): int{
        $col = $this->collection('join_lesson');
        return $col->countDocuments([
            'id_student' => $this->toObjectId($user_id),
            'lesson_id' => $this->toObjectId($lesson_id)
        ]);
    }

    public function joinLesson($lesson_id, $id_student): void{
        $lessonModel = new Lesson();
        $lesson = $lessonModel->findById($lesson_id);
        if (!$lesson) {
            throw new \Exception('Aula não encontrada');
        }

        if (isset($lesson['max_quantity']) && isset($lesson['current_quantity']) && $lesson['current_quantity'] >= $lesson['max_quantity']) {
            throw new \Exception('A aula já atingiu o número máximo de alunos');
        }

        $colLessons = $this->collection('lessons');
        $colLessons->updateOne(['_id' => $this->toObjectId($lesson_id)], ['$inc' => ['current_quantity' => 1]]);

        $colJoin = $this->collection('join_lesson');
        $colJoin->insertOne([
            'id_student' => $this->toObjectId($id_student),
            'lesson_id' => $this->toObjectId($lesson_id)
        ]);
    }

    public function isJoinLesson($lesson_id, $student_id): bool{
        $col = $this->collection('join_lesson');
        return ($col->countDocuments([
            'id_student' => $this->toObjectId($student_id),
            'lesson_id' => $this->toObjectId($lesson_id)
        ]) > 0);
    }

    public function leaveLesson($lesson_id, $id_student): void{
        $colLessons = $this->collection('lessons');
        $colLessons->updateOne(['_id' => $this->toObjectId($lesson_id)], ['$inc' => ['current_quantity' => -1]]);

        $colJoin = $this->collection('join_lesson');
        $colJoin->deleteOne([
            'id_student' => $this->toObjectId($id_student),
            'lesson_id' => $this->toObjectId($lesson_id)
        ]);
    }

    public function removeAllStudentsFromLesson($lesson_id): void{
        $col = $this->collection('join_lesson');
        $col->deleteMany(['lesson_id' => $this->toObjectId($lesson_id)]);
    }
}
