import { Injectable } from '@angular/core';
import { Http } from './http.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class Role {

  constructor(private http: Http, private router: Router, private toast: HotToastService){}

  private role: string = "off";

  check(): void{
    this.http.get("/").subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api?.data !== null){
          this.role = return_api.data;
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
    })
  }

  get(): string{
    return this.role;
  }
}
