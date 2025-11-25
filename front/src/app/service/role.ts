import { Injectable } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Role {

  constructor(private http: Http, private router: Router){}
  
  private set(role: string): void{
    sessionStorage.setItem("role", role);
  }

  check(): void{
    this.http.get("/").subscribe({
      next: (return_api: any) => {
        if(return_api != null && return_api?.role !== null){
          this.set(return_api.role);
        }
        else{
          this.set("off");
        }
      },
      error: erro => {
        console.log("Erro")
        alert(erro.error.message);
        console.log(erro);
        this.router.navigate([erro.error.redirect]);
        this.set("off");
      }
    })
  }

  get(): string{
    return sessionStorage.getItem("role") as string;
  }
}
