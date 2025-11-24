import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../interfaces';
import { Http } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-component',
  imports: [CommonModule],
  templateUrl: './data-component.html',
  styleUrl: './data-component.scss',
})
export class DataComponent implements OnInit{
  lessons: lesson[] | null = null;
  quantidade_dias_mes: number = 0;
  elements_information: any = [];

  mes_atual: number = (new Date().getMonth() + 1);
  ano_atual: number = new Date().getFullYear();
  quantidade: number = 0;

  constructor(private http: Http, private router: Router){}

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
