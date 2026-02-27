import { Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { AllLessons, CalendarDay, Lesson, ReturnApi, YourLessons } from '../interfaces_types';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: Http, private router: Router, private toast: HotToastService) { }

  public role = "off";
  public months_in_portugues = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  private readonly day_of_weeks_in_portugues = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  public currentTimestamp = Date.now();
  public current_year = new Date().getFullYear();
  public selected_month = new Date().getMonth() + 1;
  public current_day = new Date().getDate();

  public all_lessons: AllLessons = [];
  public your_lessons: YourLessons = [];

  public controller_req_all = false;
  public controller_req_your = false;

  public lessons_calender = signal<CalendarDay[]>([]);

  
  public getAllLessons(is_update: boolean = false) {
    this.http.get<AllLessons>(`/aulas?month=${this.months_in_portugues[this.selected_month - 1]}`).subscribe({
      next: (return_api: ReturnApi<AllLessons>) => {
        if (return_api.data !== null) {
          this.all_lessons = [...return_api.data].sort((lesson_a, lesson_b) => lesson_a.timestamp_lesson_start - lesson_b.timestamp_lesson_start);
        }

        this.controller_req_all = true;
        this.loadLessons(is_update);
      },
      error: error => {
        this.controller_req_all = true;
        this.loadLessons(is_update);

        if (error.error.message != null) {
          this.toast.success(error.error.message);
        }

        if (error.error.redirect !== null) {
          this.router.navigate([error.error.redirect]);
        }
      }
    });

  }

  public getYourLessons(is_update: boolean = false) {
    if(this.role == "student"){
      this.http.get<YourLessons>("/aulas/ingressadas").subscribe({
        next: (return_api: ReturnApi<YourLessons>) => {
          if (return_api.data != null) {
            this.your_lessons = return_api.data;
          }
          
          this.controller_req_your = true;
          this.loadLessons(is_update);
        },
        error: error => {
          this.controller_req_your = true;
          this.loadLessons(is_update);
        }
      });
    }
    else if(this.role == "teacher"){
      this.http.get<YourLessons>("/aulas/cadastradas").subscribe({
        next: (return_api: ReturnApi<YourLessons>) => {
          if (return_api.data != null) {
            this.your_lessons = return_api.data;
          }
          
          this.controller_req_your = true;
          this.loadLessons(is_update);
        },
        error: error => {
          this.controller_req_your = true;
          this.loadLessons(is_update);
        }
      });
    }
    else{
      this.controller_req_your = true;
    }
  }

  public loadLessons(is_update: boolean = false) {
    if (this.controller_req_all === false || this.controller_req_your === false) {
      return;
    }

    const last_day_of_last_month = new Date(this.current_year, this.selected_month - 1, 0).getDate();
    const first_day_weekday = new Date(this.current_year, this.selected_month - 1, 1).getDay();
    const last_day_of_month = new Date(this.current_year, this.selected_month, 0).getDate();

    const lessons: CalendarDay[] = [];
    let cont_lessons = 0;

    for (let weekday = 0; weekday < first_day_weekday; weekday++) {
      lessons.push({
        day: last_day_of_last_month - first_day_weekday + weekday + 1,
        day_of_the_week: this.day_of_weeks_in_portugues[weekday],
        current_month: false,
      });
    }

    for (let day = 1; day <= last_day_of_month; day++) {
      let with_lesson = false;

      while (
        cont_lessons < this.all_lessons.length &&
        new Date(this.all_lessons[cont_lessons].timestamp_lesson_start).getDate() === day
      ) {
        with_lesson = true;
        cont_lessons++;
      }

      lessons.push({
        day,
        day_of_the_week: this.day_of_weeks_in_portugues[(first_day_weekday + day - 1) % 7],
        current_month: true,
        with_lesson,
      });
    }

    const remaining_days = (7 - (lessons.length % 7)) % 7;
    for (let day = 1; day <= remaining_days; day++) {
      lessons.push({
        day,
        day_of_the_week: this.day_of_weeks_in_portugues[(first_day_weekday + last_day_of_month - 1 + day) % 7],
        current_month: false,
      });
    }

    this.controller_req_all = false;
    this.controller_req_your = false;

    if (is_update === false) {
      this.lessons_calender.set(lessons);
      if (this.lesson_selected === null) {
        this.selectLesson(this.current_day, true);
      }
      else {
        this.loadMenu(this.lesson_selected);
      }
    }
    else if (this.lesson_selected !== null) {
      this.selectLesson(this.lesson_selected, true);
    }
  }

  public lesson_of_the_day: Lesson[] = [];
  public loadMenu(day: number) {

    const your_lessons_ids = new Set(this.your_lessons.map((lesson) => lesson.id));

    const lessons_of_the_day = this.all_lessons
      .filter((lesson) => new Date(lesson.timestamp_lesson_start).getDate() === day)
      .map((lesson) => ({ ...lesson, your_lesson: your_lessons_ids.has(lesson.id) }));

    this.lesson_of_the_day = lessons_of_the_day;
  }

  public lesson_selected: number | null = null;
  public isLessonSelected(day: number, current_month: boolean): boolean {
    if (!current_month) {
      return false;
    }

    if (this.lesson_selected !== null) {
      return this.lesson_selected === day;
    }

    return this.current_day === day;
  }

  public selectLesson(day_selected: number, current_month: boolean) {

    if (current_month === false) {
      return;
    }

    this.lesson_selected = day_selected;
    this.loadMenu(day_selected);
  }
}