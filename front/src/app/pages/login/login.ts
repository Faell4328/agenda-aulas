import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../service/http.service';
import { RoleService } from '../../service/role.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ReturnApi } from '@src/app/interfaces_types';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected email: string = '';
  protected password: string = '';

  constructor(private http: Http, private router: Router, private roleService: RoleService, private toast: HotToastService){}

  formSubmit(){
    const data = {
      "email": this.email,
      "password": this.password
    }

    this.http.post<null>("/login", data).subscribe({
      next: (return_api: ReturnApi<null>) => {
        if(return_api?.message != null){
          this.toast.success(return_api.message);
        }

        if(return_api?.redirect != null){
          this.router.navigate([return_api.redirect]);
        }

        this.roleService.check();
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
