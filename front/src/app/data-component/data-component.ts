import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../interfaces';
import { Http } from '../http.service';

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

  constructor(private http: Http){}

  getAllLessons(){
    this.http.get("/aulas").subscribe({
      next: (ok) => {
        if(ok.data !== null){

          // ex: 30
          this.quantidade_dias_mes = new Date(this.ano_atual, this.mes_atual, 0).getDate();

          for(let cont = 1; cont <= this.quantidade_dias_mes; cont++){

            const lessons = ok.data.filter((lesson: any) => {
              if(lesson.day == cont){
                return lesson;
              }
            });

            let elemento: any = null;
            if(lessons[0] != undefined){
              elemento = { "day": cont, "name": lessons }
            }
            else{
              elemento = { "day": cont }
            }

            this.elements_information.push(elemento);
          }

        }
      },
      error: erro => console.log(erro)
    });
  }
  
  ngOnInit(): void{
    this.getAllLessons();
  }
}
