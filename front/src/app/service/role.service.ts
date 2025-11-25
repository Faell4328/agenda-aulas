import { Injectable } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Role {

  constructor(private http: Http, private router: Router){}

  private role: string = "off";

  check(): void{
    this.http.get("/").subscribe({
      next: (return_api: any) => {
        if(return_api != null && return_api?.role !== null){
          this.role = return_api.role;
        }
      },
      error: erro => {
        console.log("Erro")
        alert(erro.error.message);
        console.log(erro);
        this.router.navigate([erro.error.redirect]);
      }
    })
  }

  get(): string{
    return this.role;
  }
}
