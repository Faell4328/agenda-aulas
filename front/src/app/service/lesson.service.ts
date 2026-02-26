import { Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { AllLessons, ReturnApi, YourLessons } from '../interfaces_types';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: Http, private router: Router, private toast: HotToastService) { }

  public months_in_portugues = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  public current_year = new Date().getFullYear();
  public selected_month = new Date().getMonth() + 1;
  public current_day = new Date().getDate();

  public all_lessons: AllLessons[] = [];
  public your_lessons: YourLessons[] = [];

  public controller_req_all = false;
  public controller_req_your = false;

  public lessons_calender = signal<any>([]);

  
  public getAllLessons(is_update: boolean = false) {
    this.http.get<AllLessons[]>(`/aulas?month=${this.months_in_portugues[this.selected_month - 1]}`).subscribe({
      next: (return_api: ReturnApi<AllLessons[]>) => {
        if (return_api.data !== null) {
          this.all_lessons = return_api.data;
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
    this.http.get<YourLessons[]>("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi<YourLessons[]>) => {
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

  public loadLessons(is_update: boolean = false) {
    if (this.controller_req_all == false || this.controller_req_your == false) {
      return;
    }

    let day_of_weeks_in_portugues = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    let last_day_of_last_month = new Date(this.current_year, this.selected_month - 1, 0).getDate();
    let first_day_weekday = new Date(this.current_year, this.selected_month - 1, 1).getDay();
    let last_day_of_month = new Date(this.current_year, this.selected_month, 0).getDate();

    let lessons = [];
    let cont_lessons = 0;

    for(var day = 0; day < last_day_of_month; day++) {
      if(day == 0){

        let with_lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          with_lesson = true;
          while(cont_lessons < this.all_lessons.length && (day + 1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        if(first_day_weekday == 1) {
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[1], current_month: true, with_lesson });
        }
        else if(first_day_weekday == 2) {
          lessons.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[2], current_month: true, with_lesson });
        }
        else if(first_day_weekday == 3) {
          lessons.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[3], current_month: true, with_lesson });
        }
        else if(first_day_weekday == 4) {
          lessons.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[4], current_month: true, with_lesson });
        }
        else if(first_day_weekday == 5) {
          lessons.push({ "day": last_day_of_last_month - 4, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[5], current_month: true, with_lesson });
        }
        else if(first_day_weekday == 6) {
          lessons.push({ "day": last_day_of_last_month - 5, "day_of_the_week": day_of_weeks_in_portugues[0], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 4, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[6], current_month: true, with_lesson });
        }
        else{
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[0], current_month: true, with_lesson });
        }
      }
      else if((day+1) == last_day_of_month){

        let with_lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          with_lesson = true;
          while((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        if(((first_day_weekday + day) % 7) == 0) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[0], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[1], current_month: false });
          lessons.push({ "day": 2, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": 3, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": 4, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": 5, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": 6, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else if(((first_day_weekday + day) % 7) == 1) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[1], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[2], current_month: false });
          lessons.push({ "day": 2, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": 3, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": 4, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": 5, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else if(((first_day_weekday + day) % 7) == 2) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[2], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[3], current_month: false });
          lessons.push({ "day": 2, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": 3, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": 4, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else if(((first_day_weekday + day) % 7) == 3) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[3], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[4], current_month: false });
          lessons.push({ "day": 2, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": 3, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else if(((first_day_weekday + day) % 7) == 4) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[4], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[5], current_month: false });
          lessons.push({ "day": 2, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else if(((first_day_weekday + day) % 7) == 5) {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[5], current_month: true, with_lesson });
          lessons.push({ "day": 1, "day_of_the_week": day_of_weeks_in_portugues[6], current_month: false });
        }
        else {
          lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[6], current_month: true, with_lesson });
        }
      }
      else{
        let with_lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          with_lesson = true;
          while((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        lessons.push({ "day": (day+1) , "day_of_the_week": day_of_weeks_in_portugues[(first_day_weekday+day) % 7], current_month: true, with_lesson });
      }
    }

    this.controller_req_all = false;
    this.controller_req_your = false;

    if(is_update == false) {
      this.lessons_calender.set(lessons);
      if(this.lesson_selected == null) {
        this.selectLesson(this.current_day, true);
      }
      else{
        this.loadMenu(this.lesson_selected);
      }
    }
    else{
      this.selectLesson(this.lesson_selected, true);
    }
  }

  public lesson_of_the_day: any = [];
  public loadMenu(day: number){

    let lessons_of_the_day = this.all_lessons.filter((lesson: any) => {
      console.log(`${new Date(lesson.timestamp_lesson_start).getDate()} - ${day}`)
      return new Date(lesson.timestamp_lesson_start).getDate() === day;
    });

    if(lessons_of_the_day.length > 0) {
      this.your_lessons.forEach((your_lesson: any) => {

        let cont = 0;
        while(cont < lessons_of_the_day.length) {
          if(your_lesson.id == lessons_of_the_day[cont].id) {
            lessons_of_the_day[cont] = { ...lessons_of_the_day[cont], is_ingressed: true };
          }
          cont++;
        }
      });
    }
    
    this.lesson_of_the_day = lessons_of_the_day;
  }

  public lesson_selected: any = null;
  public selectLesson(day_selected: any, current_month: boolean) {

    if(current_month == false) {
      return;
    }

    document.getElementById(`day-${this.current_day}`)?.classList.remove("lesson-selected");

    if(this.lesson_selected == null) {
      document.getElementById(`day-${day_selected}`)?.classList.add("lesson-selected");
    }
    else{
      document.getElementById(`day-${this.lesson_selected}`)?.classList.remove("lesson-selected");
      document.getElementById(`day-${day_selected}`)?.classList.add("lesson-selected");
    }
    
    
    this.lesson_selected = day_selected;
    this.loadMenu(day_selected);
  }
}