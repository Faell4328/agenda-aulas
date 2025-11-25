import { Routes } from '@angular/router';
import { Cadastrar } from './pages/cadastrar/cadastrar';
import { Login } from './pages/login/login';
import { Index } from './pages/index';


export const routes: Routes = [
    { path: '', component: Index },
    { path: 'login', component: Login },
    { path: 'cadastrar', component: Cadastrar },
];