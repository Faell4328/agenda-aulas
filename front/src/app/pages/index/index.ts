import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { lesson } from '../../interfaces';
import { Router } from '@angular/router';
import { Http } from '../../service/http.service';
import { RoleService } from '../../service/role.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../component/dialog-confirmation/dialog-confirmation';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonService } from '@src/app/service/lesson.service';
import { DialogForm } from '@src/app/component/dialog-form/dialog-form';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data-component',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index implements OnInit {

  constructor(private http: Http, private router: Router, public roleService: RoleService, private toast: HotToastService, public lessonService: LessonService) { }

  readonly dialog = inject(MatDialog);

  clickLesson(element_id: any) {
    this.router.navigate([`/aula/${element_id}`]);
  }

  joinLesson(lesson_id: string) {
    this.http.post(`/aulas/ingressar?id=${lesson_id}`, null).subscribe({
      next: (return_api) => {
        if (return_api.message) {
          this.toast.success(return_api.message);
          // AQUI
          this.lessonService.getAllLessons(true);
          this.lessonService.getYourLessons(true);
        }
      },
      error: (error) => {
        if ((typeof error.error.message) == "string") {
          this.toast.error(error.error.message);

          this.lessonService.getAllLessons(true);
          this.lessonService.getYourLessons(true);
        }
      }
    });
  }

  leaveLesson(lesson_id: string) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        text: "Deseja realmente sair a aula?",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.http.delete(`/aulas/sair?id=${lesson_id}`).subscribe({
          next: (return_api) => {
            if (return_api.message) {
              this.toast.success(return_api.message);
              // AQUI
              this.lessonService.getAllLessons(true);
              this.lessonService.getYourLessons(true);
            }
          },
          error: (error) => {
            if ((typeof error.error.message) == "string") {
              this.toast.error(error.error.message);

              this.lessonService.getAllLessons(true);
              this.lessonService.getYourLessons(true);
            }
          }
        });
      }
    })
  }

  ngOnInit(): void {
    //this.getAllLessons();
  }
}
