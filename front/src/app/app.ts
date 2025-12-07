import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './component/header/header';
import { RoleService } from './service/role.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{

  constructor(private roleService: RoleService){}

  ngOnInit(): void {
    this.roleService.check();
  }
}