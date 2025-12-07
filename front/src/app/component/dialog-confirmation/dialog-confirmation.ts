import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog-confirmation',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatButton, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog-confirmation.html',
  styleUrl: './dialog-confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmation{
  public dialog = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialog = this.data.dialog;
  }

  @Input() component!: any;
}