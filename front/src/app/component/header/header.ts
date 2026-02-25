import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { Http } from '../../service/http.service';
import { DialogConfirmation } from '../dialog-confirmation/dialog-confirmation';
import { DialogForm } from '../dialog-form/dialog-form';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';
import { LessonService } from '@src/app/service/lesson.service';
import { ReturnApi } from '@src/app/interfaces_types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'header',
  imports: [MatDialogModule, RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  constructor(private router: Router, public roleService: RoleService, private http: Http, private toast: HotToastService, public lessonService: LessonService, private cdr: ChangeDetectorRef) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        console.log('URL mudou:', this.currentUrl);
        console.log('URL atual:', this.router.url == "/login");
        this.cdr.detectChanges();
      });
  }

  public current_route = "";
  public currentUrl: string;
  readonly dialog = inject(MatDialog);

  previousMonth() {
    if(this.lessonService.selected_month == 1) {
      this.lessonService.selected_month = 13;
    }

    this.lessonService.selected_month--;

    this.roleService.update_dependencies();
  }

  nextMonth() {
    if(this.lessonService.selected_month == 12) {
      this.lessonService.selected_month = 0;
    }

    this.lessonService.selected_month++;

    this.roleService.update_dependencies();
  }

  addLesson() {
    this.dialog.open(DialogForm, {
      data: {
        dialog: [
          {
            "id": "input1",
            "label": "Nome",
            "name": "name",
            "type": "string",
          },
          {
            "id": "input2",
            "label": "Dia",
            "name": "date",
            "type": "date",
          },
          {
            "id": "input3",
            "label": "Horas",
            "name": "time",
            "type": "time",
          },
          {
            "id": "input4",
            "label": "Quantidade",
            "name": "quantity",
            "type": "number",
          }
        ],
        title: "Cadastrar aula",
        method: "post",
        url: "/aulas/adicionar",
        runAfterSucess: () => { this.lessonService.getAllLessons(); this.lessonService.getYourLessons(); },
      },
    });
  }

  login() {
    this.router.navigate(["/login"]);
  }

  logout() {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: "Deseja realmente deslogar?",
        message: "Você terá que logar novamente para acessar as funcionalidades do site.",
        button_text: "Deslogar",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.http.post<null>("/logout", null).subscribe({
          next: (return_api: ReturnApi<null>) => {
            if ((typeof return_api.message) == "string") {
              this.toast.success(return_api.message);
            }

            this.roleService.check();
          },
          error: (error) => {
            if (error.error.message != null) {
              this.toast.error(error.error.message);
            }
          }
        });
      }
    });
  }
}