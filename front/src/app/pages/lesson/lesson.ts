import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { HotToastService } from "@ngxpert/hot-toast";
import { DialogConfirmation } from "@src/app/component/dialog-confirmation/dialog-confirmation";
import { DialogForm } from "@src/app/component/dialog-form/dialog-form";
import { returnApi } from "@src/app/interfaces";
import { Http } from "@src/app/service/http.service";
import { LessonService } from "@src/app/service/lesson.service";
import { RoleService } from "@src/app/service/role.service";

interface informationLesson {
  name: string;
  teacher: string;
  date: String;
  time_start: String;
  time_finish: String;
  students: String;
  current_quantity: number;
  max_quantity: number;
  is_join: boolean;
}

@Component({
  selector: 'app-lesson',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
})

export class Lesson implements OnInit {

  constructor(private route: ActivatedRoute, private toast: HotToastService, private http: Http, public roleService: RoleService, private lessonService: LessonService, private router: Router) { }

  readonly dialog = inject(MatDialog);

  private lessonId: string = '';
  public informationLesson: informationLesson | null = null;
  public isLessonJoined: boolean = false;

  private getSpecificLesson() {
    this.http.get(`/aulas?id=${this.lessonId}`).subscribe({
      next: (return_api: returnApi) => {
        let time_lesson_start: Date | string = new Date(return_api.data[0].timestamp_lesson_start);
        let time_lesson_finish: Date | string = new Date(return_api.data[0].timestamp_lesson_finish);

        return_api.data[0].date = `${time_lesson_finish.getDate().toString().padStart(2, "0")}/${(time_lesson_finish.getMonth() + 1).toString().padStart(2, "0")}/${time_lesson_finish.getFullYear()}`;

        time_lesson_start = `${time_lesson_start.getHours().toString().padStart(2, "0")}:${time_lesson_start.getMinutes().toString().padStart(2, "0")}`;
        return_api.data[0].time_start = time_lesson_start;

        time_lesson_finish = `${time_lesson_finish.getHours().toString().padStart(2, "0")}:${time_lesson_finish.getMinutes().toString().padStart(2, "0")}`;
        return_api.data[0].time_finish = time_lesson_finish;

        return_api.data[0].students = return_api.data[0].students.join(", ");

        console.log(this.informationLesson?.is_join);
        this.informationLesson = return_api.data[0];
      },
      error: (error) => {
        console.log("Erro ao consultar");
        console.error(error);
        if ((typeof error.error.message) == "string") {
          this.toast.error(error.error.message);
        }
      }
    })
  }

  joinLesson() {
  }

  leaveLesson() {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        text: "Deseja realmente sair a aula?",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.http.delete(`/aulas/sair?id=${this.lessonId}`).subscribe({
          next: (return_api) => {
            if (return_api.message) {
              this.toast.success(return_api.message);
              this.getSpecificLesson();
              this.lessonService.getAllLessons();
              this.lessonService.getYourLessons();
            }
          },
          error: (error) => {
            if ((typeof error.error.message) == "string") {
              this.toast.error(error.error.message);
            }
          }
        });
      }
    })
  }

  editLesson() {
    this.dialog.open(DialogForm, {
      data: {
        dialog: [
          {
            "id": "input1",
            "label": "Nome",
            "name": "name",
            "type": "string",
            "default": this.informationLesson?.name,
          },
          {
            "id": "input2",
            "label": "Dia",
            "name": "date",
            "type": "date",
            "default": this.informationLesson?.date,
          },
          {
            "id": "input3",
            "label": "Horas",
            "name": "time",
            "type": "time",
            "default": this.informationLesson?.time_start,
          },
          {
            "id": "input4",
            "label": "Quantidade",
            "name": "quantity",
            "type": "number",
            "default": this.informationLesson?.max_quantity,
          }
        ],
        title: "Atualizar aula",
        method: "put",
        url: `/aulas/atualizar?id=${this.lessonId}`,
        runAfterSucess: () => { this.lessonService.getAllLessons(); this.lessonService.getYourLessons(); this.getSpecificLesson() },
      },
    });
  }

  deleteLesson() {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        text: "Deseja realmente deletar a aula?",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.http.delete(`/aulas/deletar?id=${this.lessonId}`).subscribe({
          next: (return_api) => {

            if (return_api?.redirect != null) {
              this.router.navigate([return_api.redirect]);
            }

            if (return_api.message) {
              this.toast.success(return_api.message);
              this.lessonService.getAllLessons();
              this.lessonService.getYourLessons();
            }
          },
          error: (error) => {
            if ((typeof error.error.message) == "string") {
              this.toast.error(error.error.message);
            }
          }
        });
      }
    })
  };

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get("id") || "";
    this.getSpecificLesson();
  }
}

