import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'dialog-lesson',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatButton],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLesson {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = this.data.message;
    this.message_buttom = this.data.message_buttom;
  }

  public message = "";
  public message_buttom = "";
}