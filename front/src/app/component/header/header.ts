import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { DialogAuth } from '../dialog-auth/dialog';
import { Role } from '../../service/role.service';
import { Http } from '../../service/http.service';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, private role: Role, private http: Http){}

  readonly dialog = inject(MatDialog);

  check(){
    if(this.role.get() != "off"){
      const dialogRef = this.dialog.open(DialogAuth);
      
      dialogRef.afterClosed().subscribe(result => {
        if(result == true){
          this.http.post("/logout", null).subscribe({
            next: (return_api) => {
              console.log("OK");
              console.log(return_api);
              this.role.check();
              if(return_api){
                alert(return_api.message);
              }
            },
            error: (error) => {
              console.log("ERROR");
              console.log(error.message);
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
