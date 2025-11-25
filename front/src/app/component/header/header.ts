import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Dialog } from '../dialog/dialog';
import { Role } from '../../service/role';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, private role: Role){}

  readonly dialog = inject(MatDialog);

  check(){
    if(this.role.get() != "off"){
      const dialogRef = this.dialog.open(Dialog);
      
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}
