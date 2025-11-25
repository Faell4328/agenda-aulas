import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../../interfaces';
import { Router } from '@angular/router';
import { Http } from '../../service/http.service';
import { Role } from '../../service/role.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogLesson } from '../../component/dialog-lesson/dialog';

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

  constructor(private http: Http, private router: Router, private role: Role){}

  readonly dialog = inject(MatDialog);

  joinLesson(element_id: any){

    if(this.role.get() != "student"){
      return;
    }
    
    const dialogRef = this.dialog.open(DialogLesson);

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.http.post(`/aulas/ingressar?id=${element_id}`, null).subscribe({
          next: (return_api) => {
            console.log("OK");
            this.getYourLessons();
            if(return_api.message != null){
              alert(return_api.message);
            }
          },
          error: (error) => {
            console.log("ERROR");
            console.log(error);
            if(error.error.message != null){
              alert(error.error.message);
            }
          }
        });
      }
    });
  }

  getAllLessons(){
    this.http.get("/aulas").subscribe({
      next: (return_api) => {
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

          const returned_rule = this.role.get();
          if(returned_rule != "off" && returned_rule != "teacher"){
            this.getYourLessons();
          }
        }
      },
      error: erro => {
        console.log("Erro")
        alert(erro.error.message);
        console.log(erro);
        this.router.navigate([erro.error.redirect]);
      }
    });
  }

  getYourLessons(){
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api) => {
        if(return_api.data !== null){
          return_api.data.map((yourLesson: any) => {
            let element = document.getElementById(yourLesson.id) as HTMLElement;
            element = element.childNodes[0] as HTMLElement;

            element.classList.remove("status-no");
            element.classList.add("status-ok");
            element.innerHTML="Inscrito";
          })
        }
      },
      error: erro => {
        console.log("Erro")
        alert(erro.error.message);
        console.log(erro);
        this.router.navigate([erro.error.redirect]);
      }
    });
  }

  ngOnInit(): void{
    this.getAllLessons();
  }
}
