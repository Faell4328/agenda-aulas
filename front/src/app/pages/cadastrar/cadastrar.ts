import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../service/http.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ReturnApi } from '@src/app/interfaces_types';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.scss',
})
export class Cadastrar {
  protected name: string = '';
  protected role: string = '';
  protected email: string = '';
  protected password: string = '';

  constructor(private http: Http, private router: Router, private toast: HotToastService){}

  public formSubmit(){
    const data = {
      name: this.name,
      role: this.role,
      email: this.email,
      password: this.password
    };

    this.http.post<null>("/cadastrar", data).subscribe({
      next: (return_api: ReturnApi<null>) => {
        if ((typeof return_api.message) === "string") {
          this.toast.success(return_api.message);
        }

        if (typeof return_api.redirect === 'string') {
          this.router.navigate([return_api.redirect]);
        }
      },
      error: (error) => {
        if ((typeof error.error.message) === "string") {
          this.toast.error(error.error.message);
        }
      }
    });
  }

  public hide = signal(true);
  public changePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
