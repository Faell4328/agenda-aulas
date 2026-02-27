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
    your_lesson?: boolean;
}

export type CalendarDay = {
    day: number;
    day_of_the_week: string;
    current_month: boolean;
    with_lesson?: boolean;
}

export type AllLessons = Lesson[];
export type YourLessons = Lesson[];