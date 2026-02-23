import { effect, Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: Http, private router: Router, private toast: HotToastService) { }

  private req_all = false;
  private all_lessons: any = [];
  private req_your = false;
  private your_lessons: any = [];
  public current_day = new Date().getDate();

  public elements_information = signal<any>([]);

  private lessons: any | null = null;
  private quantidade_dias_mes: number = 0;

  private mes_atual: number = (new Date().getMonth() + 1);
  private ano_atual: number = new Date().getFullYear();
  private quantidade: number = 0;

  public async getAllLessons() {
    this.http.get("/aulas").subscribe({
      next: (return_api: ReturnApi) => {
        if (return_api.data !== null) {
          this.all_lessons = return_api.data;
          console.log("all")
          console.log(return_api.data);
        }

        this.req_all = true;
        this.loadLessons2();
      },
      error: error => {
        this.req_all = true;
        this.loadLessons2();

        if (error.error.message != null) {
          this.toast.success(error.error.message);
        }

        if (error.errror.redirect !== null) {
          this.router.navigate([error.error.redirect]);
        }
      }
    });

  }

  public async getYourLessons() {
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi) => {
        if (return_api.data != null) {
          this.your_lessons = return_api.data;
          console.log("your")
          console.log(return_api.data);
        }
        
        this.req_your = true;
        this.loadLessons2();
      },
      error: error => {
        console.log("Sua lição: Deu erro")
        console.log(error);
        this.req_your = true;
        this.loadLessons2();
      }
    });
  }

  // public loadLessons() {
  //   if (this.req_all == false || this.req_your == false) {
  //     return;
  //   }

  //   console.log("Lições");
  //   this.all_lessons.map((lesson: any) => {
  //     console.log((lesson.timestamp_lesson_start))
  //     console.log(new Date(lesson.timestamp_lesson_start))
  //   })

  //   this.elements_information.set([]);

  //   // ex: 30
  //   this.quantidade_dias_mes = new Date(this.ano_atual, this.mes_atual, 0).getDate();

  //   let index_all = 0;
  //   let index_your = 0;
  //   let elements = [];
  //   for (let present_day = 1; present_day <= this.quantidade_dias_mes; present_day++) {

  //     let lessons: any = []

  //     console.log("Dia presente é ");
  //     console.log(present_day);

  //     while (index_all < this.all_lessons.length) {

  //       console.log("Indice")
  //       console.log(index_all);
  //       console.log("Dia da aula testada é: ")
  //       console.log(new Date(this.all_lessons[index_all].timestamp_lesson_start).getDate());

  //       if ((new Date(this.all_lessons[index_all].timestamp_lesson_start)).getDate() == present_day) {

  //         const date = new Date(this.all_lessons[index_all].timestamp_lesson_start);
  //         const time = `${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}`

  //         if (this.all_lessons[index_all].id == this.your_lessons[index_your]?.id) {
  //           lessons.push({ ...this.all_lessons[index_all], time: time, "registered": true });
  //           index_your++;
  //         }
  //         else {
  //           lessons.push({ ...this.all_lessons[index_all], time: time, "registered": false });
  //         }
  //         index_all++;
  //       }
  //       else {
  //         break;
  //       }
  //     }

  //     let elemento: any = null;
  //     let names_of_days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  //     let day_of_the_week = new Date(this.ano_atual, this.mes_atual - 1, present_day).getDay();
  //     if (lessons[0] != undefined) {
  //       elemento = { "day": present_day, "lessons": lessons, "day_of_the_week": names_of_days[day_of_the_week] }
  //     }
  //     else {
  //       elemento = { "day": present_day, "day_of_the_week": names_of_days[day_of_the_week] }
  //     }

  //     elements.push(elemento);
  //   }
  //   console.log(elements);
  //   this.elements_information.set(elements);


  //   this.all_lessons = [];
  //   this.your_lessons = [];
  //   this.req_all = false;
  //   this.req_your = false;
  // }


  public loadLessons2() {
    if (this.req_all == false || this.req_your == false) {
      return;
    }

    // Preparation of the weeks
    this.mes_atual = 3;
    let last_day_of_last_month = new Date(this.ano_atual, this.mes_atual - 1, 0).getDate();
    let day_of_weeks = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let first_day_of_the_week = new Date(this.ano_atual, this.mes_atual - 1, 1).getDay();
    let last_day_of_month = new Date(this.ano_atual, this.mes_atual, 0).getDate();

    let days_of_week = [];

    for(var day = 0; day < last_day_of_month; day++) {
      if(day == 0){

        const lesson = this.all_lessons.some((l: any) => { const d = new Date(l?.timestamp_lesson_start); return d.getDate() === (day+1) && (d.getMonth() + 1) === this.mes_atual && d.getFullYear() === this.ano_atual; });

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

        const lesson = this.all_lessons.some((l: any) => { const d = new Date(l?.timestamp_lesson_start); return d.getDate() === (day+1) && (d.getMonth() + 1) === this.mes_atual && d.getFullYear() === this.ano_atual; });

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
        const lesson = this.all_lessons.some((l: any) => { const d = new Date(l?.timestamp_lesson_start); return d.getDate() === (day+1) && (d.getMonth() + 1) === this.mes_atual && d.getFullYear() === this.ano_atual; });
        days_of_week.push({ "day": (day+1) , "day_of_the_week": day_of_weeks[(first_day_of_the_week+day) % 7], current_month: true, lesson });
      }
    }

    // let separe_days_of_week = [];
    // for(var cont = 0; cont < (days_of_week.length/7); cont++) {
    //   separe_days_of_week.push(days_of_week.slice((cont * 7), ((cont +1)*7)));
    // }

    console.log(days_of_week);
    this.elements_information.set(days_of_week);
    this.loadMenu(this.current_day);
  }

  public lesson_of_the_day: any = [];
  public loadMenu(day: number){
    console.log("Menu carregado para o dia " + day);
    const lessons = this.all_lessons.filter((lesson: any) => {
      return new Date(lesson.timestamp_lesson_start).getDate() === day;
    });

    if(lessons.length > 0) {
      console.log("Entrou em your lesson")
      this.your_lessons.find((your_lesson: any) => {
        if(your_lesson.id == lessons[0].id) {
          lessons[0] = { ...lessons[0], is_ingressed: true };
        }
      });
    }
    
    this.lesson_of_the_day = lessons;
    console.log(this.lesson_of_the_day);
  }

  private oldLesson: any = null;
  public selectLesson(day: any) {
    console.log("Old Lesson")
    console.log(this.oldLesson)

    if(document.getElementById(`day-${this.current_day}`) !== null) {
      document.getElementById(`day-${this.current_day}`)?.classList.remove("lesson-selected");
    }

    if(this.oldLesson == null) {
      this.oldLesson = document.getElementById(`day-${this.current_day}`);
    }
    
    this.oldLesson.classList.remove("lesson-selected");
    this.oldLesson = document.getElementById(`day-${day}`);
    this.oldLesson.classList.add("lesson-selected");
    this.loadMenu(day);
  }
}