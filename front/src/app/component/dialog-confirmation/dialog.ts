import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dialog-confirmation',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatButton, CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog{
  public dialog = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialog = this.data.dialog;
  }

  @Input() component!: any;
}