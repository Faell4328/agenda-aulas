import { effect, Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: Http, private router: Router, private toast: HotToastService){}

  private req_all = false;
  private all_lessons: any = [];
  private req_your = false;
  private your_lessons: any = [];

  public elements_information = signal<any>([]);

  private lessons: any | null = null;
  private quantidade_dias_mes: number = 0;

  private mes_atual: number = (new Date().getMonth() + 1);
  private ano_atual: number = new Date().getFullYear();
  private quantidade: number = 0;

  public async getAllLessons(){
    this.http.get("/aulas").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api.data !== null){
          this.all_lessons = return_api.data;
          console.log("all")
          console.log(return_api.data);
        }

        this.req_all = true;
        this.loadLessons();
      },
      error: error => {
        this.req_all = true;
        this.loadLessons();

        if(error.error.message != null){
          this.toast.success(error.error.message);
        }

        if(error.errror.redirect !== null){
          this.router.navigate([error.error.redirect]);
        }
      }
    });

  }

  public async getYourLessons(){
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api.data != null){
          this.your_lessons = return_api.data;
          console.log("your")
          console.log(return_api.data);
        }

        this.req_your = true;
        this.loadLessons();
      },
      error: error => {
        this.req_your = true;
        this.loadLessons();
      }
    });
  }

  public loadLessons(){
    if(this.req_all == false || this.req_your == false){
      return;
    }

    this.elements_information.set([]);

      // ex: 30
      this.quantidade_dias_mes = new Date(this.ano_atual, this.mes_atual, 0).getDate();

      let index_all = 0;
      let index_your = 0;
      let elements = [];
      for(let present_day = 1; present_day <= this.quantidade_dias_mes; present_day++){

        let lessons: any = []

        while(index_all < this.all_lessons.length){
          if((new Date(this.all_lessons[index_all].timestamp_lesson_start)).getDate() == present_day){

            const date = new Date(this.all_lessons[index_all].timestamp_lesson_start);
            const time = `${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}`

            if(this.all_lessons[index_all].id == this.your_lessons[index_your]?.id){
              lessons.push({...this.all_lessons[index_all], time: time, "registered": true});
              index_your++;
            }
            else{
              lessons.push({...this.all_lessons[index_all], time: time, "registered": false});
            }
            index_all++;
          }
          else{
            break;
          }
        }

        let elemento: any = null;
        if(lessons[0] != undefined){
          elemento = { "day": present_day,"lessons": lessons }
        }
        else{
          elemento = { "day": present_day }
        }

        elements.push(elemento);
      }
    console.log(elements);
    this.elements_information.set(elements);


    this.all_lessons = [];
    this.your_lessons = [];
    this.req_all = false;
    this.req_your = false;
  }
}
