import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Http } from '../../service/http.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private http: Http, private router: Router){}

  formSubmit(){
    const data = {
      "email": this.email,
      "password": this.password
    }

    this.http.post("/login", data).subscribe({
      next: (ok) => {
        console.log(ok)
        localStorage.setItem("role", ok.data);
        console.log("OK")
        alert(ok.message);
        this.router.navigate([ok.redirect]);
        console.log(ok.data);
      },
      error: (erro) => {
        console.log("Erro")
        alert(erro.error.message);
        console.log(erro);
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
