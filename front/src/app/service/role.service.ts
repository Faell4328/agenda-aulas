import { Injectable, signal } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonService } from './lesson.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: Http, private router: Router, private toast: HotToastService, private lessonService: LessonService){}

  public role = signal<string>("off");

  public update_dependencies(){
    this.lessonService.lesson_of_the_day = []
    this.lessonService.all_lessons = [];
    this.lessonService.your_lessons = [];
    this.lessonService.getAllLessons();
    this.lessonService.getYourLessons();
  }

  check(){
    this.http.get("/").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api?.data !== null){
          console.log("Role atualizada");
          console.log(return_api.data);
          this.role.set(return_api.data);
          this.update_dependencies();
        }
      },
      error: error => {
        if(error.error.message != null){
          this.toast.error(error.error.message);
        }

        if(error.error.redirect != null){
          this.router.navigate([error.error.redirect]);
        }
      }
    });
  }
}
