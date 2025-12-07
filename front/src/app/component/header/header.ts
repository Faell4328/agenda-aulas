import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { Http } from '../../service/http.service';
import { Dialog } from '../dialog-confirmation/dialog';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, MatDialogModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, public roleService: RoleService, private http: Http, private toast: HotToastService){}

  readonly dialog = inject(MatDialog);

  addLesson(){
    console.log(this.roleService.role());
  }

  login(){
    this.router.navigate(["/login"]);
  }

  logout(){
    const dialogRef = this.dialog.open(Dialog, {
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
