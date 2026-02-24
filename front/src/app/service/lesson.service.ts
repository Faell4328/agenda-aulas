import { effect, Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: Http, private router: Router, private toast: HotToastService) { }

  public req_all = false;
  public all_lessons: any = [];
  public req_your = false;
  public your_lessons: any = [];
  public current_day = new Date().getDate();

  public elements_information = signal<any>([]);

  private lessons: any | null = null;
  private quantidade_dias_mes: number = 0;

  private mes_atual: number = (new Date().getMonth() + 1);
  private ano_atual: number = new Date().getFullYear();
  private quantidade: number = 0;

  public async getAllLessons(is_update: boolean = false) {

    this.http.get("/aulas").subscribe({
      next: (return_api: ReturnApi) => {
        if (return_api.data !== null) {
          this.all_lessons = return_api.data;
          console.log("all")
          console.log(return_api.data);
        }

        this.req_all = true;
        this.loadLessons(is_update);
      },
      error: error => {
        this.req_all = true;
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

  public async getYourLessons(is_update: boolean = false) {
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi) => {
        if (return_api.data != null) {
          this.your_lessons = return_api.data;
          console.log("your")
          console.log(return_api.data);
        }
        
        this.req_your = true;
        this.loadLessons(is_update);
      },
      error: error => {
        console.log("Sua lição: Deu erro")
        console.log(error);
        this.req_your = true;
        this.loadLessons(is_update);
      }
    });
  }

  public loadLessons(is_update: boolean = false) {
    if (this.req_all == false || this.req_your == false) {
      return;
    }

    // Preparation of the weeks
    let last_day_of_last_month = new Date(this.ano_atual, this.mes_atual - 1, 0).getDate();
    let day_of_weeks = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let first_day_of_the_week = new Date(this.ano_atual, this.mes_atual - 1, 1).getDay();
    let last_day_of_month = new Date(this.ano_atual, this.mes_atual, 0).getDate();

    let days_of_week = [];
    let cont_lessons = 0;

    for(var day = 0; day < last_day_of_month; day++) {
      if(day == 0){

        let lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          lesson = true;
          while((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        // segunda
        if(first_day_of_the_week == 1) {
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[1], current_month: true, lesson });
        }
        // terça
        else if(first_day_of_the_week == 2) {
          days_of_week.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[2], current_month: true, lesson });
        }
        // quarta
        else if(first_day_of_the_week == 3) {
          days_of_week.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[3], current_month: true, lesson });
        }
        // quinta
        else if(first_day_of_the_week == 4) {
          days_of_week.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[4], current_month: true, lesson });
        }
        // sexta
        else if(first_day_of_the_week == 5) {
          days_of_week.push({ "day": last_day_of_last_month - 4, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[5], current_month: true, lesson });
        }
        // sábado
        else if(first_day_of_the_week == 6) {
          days_of_week.push({ "day": last_day_of_last_month - 5, "day_of_the_week": day_of_weeks[0], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 4, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 3, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 2, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month - 1, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": last_day_of_last_month, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[6], current_month: true, lesson });
        }
        // domingo
        else{
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[0], current_month: true });
        }
      }
      // Parei aqui 
      else if((day+1) == last_day_of_month){

        let lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          lesson = true;
          while((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        // Domingo
        if(((first_day_of_the_week + day) % 7) == 0) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[0], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[1], current_month: false });
          days_of_week.push({ "day": 2, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": 3, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": 4, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": 5, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": 6, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Segunda
        else if(((first_day_of_the_week + day) % 7) == 1) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[1], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[2], current_month: false });
          days_of_week.push({ "day": 2, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": 3, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": 4, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": 5, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Terça
        else if(((first_day_of_the_week + day) % 7) == 2) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[2], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[3], current_month: false });
          days_of_week.push({ "day": 2, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": 3, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": 4, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Quarta
        else if(((first_day_of_the_week + day) % 7) == 3) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[3], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[4], current_month: false });
          days_of_week.push({ "day": 2, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": 3, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Quinta
        else if(((first_day_of_the_week + day) % 7) == 4) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[4], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[5], current_month: false });
          days_of_week.push({ "day": 2, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Sexta
        else if(((first_day_of_the_week + day) % 7) == 5) {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[5], current_month: true, lesson });
          days_of_week.push({ "day": 1, "day_of_the_week": day_of_weeks[6], current_month: false });
        }
        // Sábado
        else {
          days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[6], current_month: true, lesson });
        }
      }
      else{
        let lesson = false;
        if((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()) {
          lesson = true;
          while((day+1) == new Date(this.all_lessons[cont_lessons]?.timestamp_lesson_start).getDate()){
            cont_lessons++;
          }
        }

        days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[(first_day_of_the_week+day) % 7], current_month: true, lesson });
      }
    }

    console.log(this.all_lessons)

    this.req_all = false;
    this.req_your = false;

    console.log(days_of_week);
    if(is_update == false) {
      this.elements_information.set(days_of_week);
      this.selectLesson(this.current_day);
    }
    else{
      this.selectLesson(this.lesson_selected);
    }
  }

  public lesson_of_the_day: any = [];
  public loadMenu(day: number){
    console.log("Carregando menu");

    const lessons_of_the_day = this.all_lessons.filter((lesson: any) => {
      console.log(`${new Date(lesson.timestamp_lesson_start).getDate()} - ${day}`)
      return new Date(lesson.timestamp_lesson_start).getDate() === day;
    });

    console.log('Lissons do dia:');
    console.log(lessons_of_the_day);

    if(lessons_of_the_day.length > 0) {
      console.log("Entrou em your lesson")
      this.your_lessons.filter((your_lesson: any) => {
        console.log(`${your_lesson.id} - ${lessons_of_the_day[0].id}`);

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
    console.log("----");
    console.log(this.lesson_of_the_day);
  }

  public lesson_selected: any = null;
  public selectLesson(day_selected: any) {
    console.log("Aula selecionada")
    console.log(this.lesson_selected);

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