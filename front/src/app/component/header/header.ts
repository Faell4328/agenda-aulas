import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../../service/role.service';
import { Http } from '../../service/http.service';
import { Dialog } from '../dialog-confirmation/dialog';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, private role: Role, private http: Http, private toast: HotToastService){}

  readonly dialog = inject(MatDialog);

  check(){
    if(this.role.get() != "off"){

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

              this.role.check();
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
    else{
      this.router.navigate(["/login"]);
    }
  }
}
