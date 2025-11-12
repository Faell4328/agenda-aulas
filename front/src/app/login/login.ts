import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Http } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private http: Http, private router: Router){}

  formSubmit(){
    const form = new FormData();
    form.append('email', this.email);
    form.append('password', this.password);

    this.http.post("/login", form).subscribe({
      next: (ok) => {
        alert(ok.message);
        this.router.navigate([ok.redirect]);
        console.log(ok.data);
      },
      error: (erro) => {
        console.log("Erro");
        alert(erro.error.message);
        this.router.navigate([erro.error.redirect]);
      }
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent){
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
