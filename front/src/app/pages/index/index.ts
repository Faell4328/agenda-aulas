import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../../interfaces';
import { Router } from '@angular/router';
import { Http } from '../../service/http.service';
import { RoleService } from '../../service/role.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../component/dialog-confirmation/dialog-confirmation';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-data-component',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index implements OnInit{
  lessons: lesson[] | null = null;
  quantidade_dias_mes: number = 0;
  elements_information: any = [];

  mes_atual: number = (new Date().getMonth() + 1);
  ano_atual: number = new Date().getFullYear();
  quantidade: number = 0;

  constructor(private http: Http, private router: Router, private roleService: RoleService, private toast: HotToastService){}

  readonly dialog = inject(MatDialog);

  joinLesson(element_id: any){

    if(this.roleService.role() != "student"){
      return;
    }
    
    let is_join:boolean = (document.getElementById(element_id)?.dataset["join"] == "true");

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

  getAllLessons(){
    this.http.get("/aulas").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api.data !== null){
          // ex: 30
          this.quantidade_dias_mes = new Date(this.ano_atual, this.mes_atual, 0).getDate();

          let current_index = 0;
          for(let present_day = 1; present_day <= this.quantidade_dias_mes; present_day++){

            let lessons: any = []

            while(current_index < return_api.data.length){
              if((new Date(return_api.data[current_index].timestamp_lesson_start)).getDate() == present_day){
                lessons.push(return_api.data[current_index]);
                current_index++;
              }
              else{
                break;
              }
            }

            let elemento: any = null;
            if(lessons[0] != undefined){
              elemento = { "day": present_day, "name":  lessons }
            }
            else{
              elemento = { "day": present_day }
            }

            this.elements_information.push(elemento);
          }

          if(this.roleService.role() != "off" && this.roleService.role() != "teacher"){
            this.getYourLessons();
          }
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
    this.getAllLessons();
  }
}
