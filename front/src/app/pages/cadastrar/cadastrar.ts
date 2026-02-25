import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Http } from '../../service/http.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ReturnApi } from '@src/app/interfaces_types';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSelectModule, RouterLink],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.scss',
})
export class Cadastrar {
  name: string = '';
  role: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: Http, private router: Router, private toast: HotToastService){}

  formSubmit(){
    const data = {
      "name": this.name,
      "role": this.role,
      "email": this.email,
      "password": this.password
    }

    this.http.post<null>("/cadastrar", data).subscribe({
      next: (return_api: ReturnApi<null>) => {
        if((typeof return_api.message) == "string"){
          this.toast.success(return_api.message);
        }
        this.router.navigate([return_api.redirect]);
      },
      error: (error) => {
        if((typeof error.error.message) == "string"){
          this.toast.error(error.error.message);
        }
        //this.router.navigate([erro.error.redirect]);
      }
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent){
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
