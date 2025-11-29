import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../service/http.service';
import { Role } from '../../service/role.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private http: Http, private router: Router, private role: Role, private toast: HotToastService){}

  formSubmit(){
    const data = {
      "email": this.email,
      "password": this.password
    }

    this.http.post("/login", data).subscribe({
      next: (return_api: ReturnApi) => {
        if(return_api?.message != null){
          this.toast.success(return_api.message);
        }

        if(return_api?.redirect != null){
          this.router.navigate([return_api.redirect]);
        }

        this.role.check();
      },
      error: (error) => {
        if(error.error.message != null){
          this.toast.error(error.error.message);
        }
      }
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent){
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
