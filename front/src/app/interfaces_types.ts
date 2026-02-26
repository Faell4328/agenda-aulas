export interface ReturnApi<T> {
    message: string | null;
    redirect: string | null;
    data: T | null;
}

export type Roles = "off" | "student" | "teacher";

export type Lesson = {
    id: string;
    name: string;
    timestamp_lesson_start: number;
    timestamp_lesson_finish: number;
    current_quantity: number;
    max_quantity: number;
    teacher?: string;
    students?: string[];
    is_ingressed?: boolean;
}

export type AllLessons = Lesson[];
export type YourLessons = Lesson[];