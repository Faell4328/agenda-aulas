import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { Http } from '../../service/http.service';
import { DialogConfirmation } from '../dialog-confirmation/dialog-confirmation';
import { DialogForm } from '../dialog-form/dialog-form';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, public roleService: RoleService, private http: Http, private toast: HotToastService){}

  readonly dialog = inject(MatDialog);

  addLesson(){
    this.dialog.open(DialogForm, {
      data: {
        dialog: [
          {
            "label": "Nome",
            "name": "name",
            "type": "string",
          },
          {
            "label": "Dia",
            "name": "date",
            "type": "date",
          },
          {
            "label": "Horas",
            "name": "time",
            "type": "time",
          },
          {
            "label": "Quantidade",
            "name": "quantity",
            "type": "number",
          }
        ],
        url: "/aulas/adicionar"
      },
    });
  }

  login(){
    this.router.navigate(["/login"]);
  }

  logout(){
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        dialog: "deslogar",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.http.post("/logout", null).subscribe({
          next: (return_api) => {
            if((typeof return_api.message) == "string"){
              this.toast.success(return_api.message);
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
    });
  }
}
