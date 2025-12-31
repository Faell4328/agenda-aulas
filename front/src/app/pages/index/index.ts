import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../../interfaces';
import { Router } from '@angular/router';
import { Http } from '../../service/http.service';
import { RoleService } from '../../service/role.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../component/dialog-confirmation/dialog-confirmation';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonService } from '@src/app/service/lesson.service';
import { DialogForm } from '@src/app/component/dialog-form/dialog-form';

@Component({
  selector: 'app-data-component',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index implements OnInit{

  constructor(private http: Http, private router: Router, private roleService: RoleService, private toast: HotToastService, public lessonService: LessonService){}

  readonly dialog = inject(MatDialog);

  clickLesson(element_id: any){
    if(this.roleService.role() == "student"){
      this.joinLesson(element_id);
      return;
    }
    else if(this.roleService.role() == "teacher"){
      this.editLesson(element_id);
    }
    else{
      return;
    }
  }

  joinLesson(element_id: any){

    let is_join:boolean = (document.getElementById(element_id)?.dataset["join"] == "true");
    console.log(is_join);

    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        dialog: (is_join == true) ? "sair" : "ingressar",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        if(is_join == true){
          this.http.delete(`/aulas/sair?id=${element_id}`).subscribe({
            next: (return_api) => {
              console.log("OK");

              let element = document.getElementById(element_id) as HTMLElement;
              element.dataset["join"] = "false";

              element = element.childNodes[0] as HTMLElement;
              
              element.classList.remove("status-ok");
              element.classList.add("status-no");
              element.innerHTML = "Não inscrito";

              if((typeof return_api.message) == "string"){
                this.toast.success(return_api.message);
              }
            },
            error: (error) => {
              if((typeof error.error.message) == "string"){
                this.toast.error(error.error.message);
              }
            }
          });
        }
        else{
          this.http.post(`/aulas/ingressar?id=${element_id}`, null).subscribe({
            next: (return_api) => {
              console.log("OK");

              let element = document.getElementById(element_id) as HTMLElement;
              element.dataset["join"] = "true";

              element = element.childNodes[0] as HTMLElement;

              element.classList.remove("status-no");
              element.classList.add("status-ok");
              element.innerHTML = "Inscrito";

              if((typeof return_api.message) == "string"){
                this.toast.success(return_api.message);
              }

            },
            error: (error) => {
              if((typeof error.error.message) == "string"){
                this.toast.error(error.error.message);
              }
            }
          });
        }
      }
    });
  }

  editLesson(element_id: any){
      this.dialog.open(DialogForm, {
        data: {
          dialog: [
            {
              "label": "Nome",
              "name": "name",
              "type": "string",
            },
            {
              "label": "Dia",
              "name": "date",
              "type": "date",
            },
            {
              "label": "Horas",
              "name": "time",
              "type": "time",
            },
            {
              "label": "Quantidade",
              "name": "quantity",
              "type": "number",
            }
          ],
          title: "Atualizar aula",
          method: "put",
          url: `/aulas/atualizar?id=${element_id}`
        },
      });
    }

  getAllLessons(){
    this.http.get("/aulas").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api.data !== null){
        }
      },
      error: error => {
        if(error.error.message != null){
          this.toast.success(error.error.message);
        }

        if(error.errror.redirect !== null){
          this.router.navigate([error.error.redirect]);
        }
      }
    });
  }

  getYourLessons(){
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api.data != null){
          return_api.data.map((yourLesson: any) => {
            let element = document.getElementById(yourLesson.id) as HTMLElement;
            element.dataset["join"] = "true";

            element = element.childNodes[0] as HTMLElement;

            element.classList.remove("status-no");
            element.classList.add("status-ok");
            element.innerHTML="Inscrito";
          })
        }
      },
      error: error => {
        if(error.error.message != null){
          this.toast.success(error.error.message);
        }
      }
    });
  }

  ngOnInit(): void{
    //this.getAllLessons();
  }
}
