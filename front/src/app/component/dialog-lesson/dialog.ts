import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'dialog-lesson',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogModule, MatButton],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLesson {
}
