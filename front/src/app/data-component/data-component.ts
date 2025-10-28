import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-component',
  imports: [],
  templateUrl: './data-component.html',
  styleUrl: './data-component.scss',
})
export class DataComponent implements OnInit{
  quantidade_dias_mes: number = 0;
  dias_atual: number[] = [];
  mes_atual: number = (new Date().getMonth() + 1);
  ano_atual: number = new Date().getFullYear();
  quantidade: number = 0;

  ngOnInit(): void{
    this.quantidade_dias_mes = new Date(this.ano_atual, this.mes_atual, 0).getDate();
    for(let cont = 1; cont <= this.quantidade_dias_mes; cont++){
      this.dias_atual.push(cont);
    }
  }
}
