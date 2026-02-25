import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { Http } from '../../service/http.service';
import { RoleService } from '../../service/role.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../component/dialog-confirmation/dialog-confirmation';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonService } from '@src/app/service/lesson.service';
import { DialogForm } from '@src/app/component/dialog-form/dialog-form';
import { MatButtonModule } from '@angular/material/button';
import { ReturnApi } from '@src/app/interfaces_types';

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
    this.http.post<null>(`/aulas/ingressar?id=${lesson_id}`, null).subscribe({
      next: (return_api: ReturnApi<null>) => {
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
        title: "Deseja realmente sair da aula?",
        button_text: "Sim",
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

  editLesson(lesson_id: string) {
    let informationLesson: any = this.lessonService.all_lessons.filter((lesson: any) => lesson.id == lesson_id)[0];
    let date = new Date(informationLesson.timestamp_lesson_start);
    informationLesson.date = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    informationLesson.time_start = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    this.dialog.open(DialogForm, {
      data: {
        dialog: [
          {
            "id": "input1",
            "label": "Nome",
            "name": "name",
            "type": "string",
            "default": informationLesson?.name,
          },
          {
            "id": "input2",
            "label": "Dia",
            "name": "date",
            "type": "date",
            "default": informationLesson?.date,
          },
          {
            "id": "input3",
            "label": "Horas",
            "name": "time",
            "type": "time",
            "default": informationLesson?.time_start,
          },
          {
            "id": "input4",
            "label": "Quantidade",
            "name": "quantity",
            "type": "number",
            "default": informationLesson?.max_quantity,
          }
        ],
        title: "Atualizar aula",
        method: "put",
        url: `/aulas/atualizar?id=${lesson_id}`,
        runAfterSucess: () => {
          this.lessonService.getAllLessons(true);
          this.lessonService.getYourLessons(true);
        },
      },
    });
  }

  deleteLesson(lesson_id: string, timestamp_lesson_start: number) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: "Deseja realmente deletar?",
        message: "A aula será deletada permanentemente e não poderá ser recuperada.",
        button_text: "Deletar",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.http.delete<null>(`/aulas/deletar?id=${lesson_id}`).subscribe({
          next: (return_api: ReturnApi<null>) => {

            if (return_api?.redirect != null) {
              this.router.navigate([return_api.redirect]);
            }

            if (return_api.message) {
              this.toast.success(return_api.message);
            }

            this.lessonService.getAllLessons();
            this.lessonService.getYourLessons();
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
  };

  ngOnInit(): void {
    //this.getAllLessons();
  }
}
