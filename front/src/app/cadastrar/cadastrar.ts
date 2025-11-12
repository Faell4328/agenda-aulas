import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Http } from '../http.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSelectModule],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.scss',
})
export class Cadastrar {
  name: string = '';
  cargo: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: Http, private router: Router){}

  formSubmit(){
    const form = new FormData();
    form.append('name', this.name);
    form.append('cargo', this.cargo);
    form.append('email', this.email);
    form.append('password', this.password);

    this.http.post("/cadastrar", form).subscribe({
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
