import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Http } from '../../service/http.service';

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

  constructor(private http: Http, private router: Router){}

  formSubmit(){
    const data = {
      "name": this.name,
      "role": this.role,
      "email": this.email,
      "password": this.password
    }

    this.http.post("/cadastrar", data).subscribe({
      next: (ok) => {
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
