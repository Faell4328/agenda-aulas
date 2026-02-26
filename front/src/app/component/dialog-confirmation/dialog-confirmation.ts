import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

type DialogConfirmationData = {
  title: string;
  message: string;
  button_text: string;
};

@Component({
  selector: 'dialog-confirmation',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './dialog-confirmation.html',
  styleUrl: './dialog-confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogConfirmation {

  public title = "";
  public message = "";
  public button_text = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogConfirmationData) {
    this.title = this.data.title;
    this.message = this.data.message;
    this.button_text = this.data.button_text;
  }
}
