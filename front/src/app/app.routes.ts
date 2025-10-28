import { Routes } from '@angular/router';
import { DataComponent } from './data-component/data-component';
import { Login } from './login/login';
import { Cadastrar } from './cadastrar/cadastrar';


export const routes: Routes = [
    { path: '', component: DataComponent },
    { path: 'login', component: Login },
    { path: 'cadastrar', component: Cadastrar },
    { path: 'cadastrar', component: Cadastrar }
];