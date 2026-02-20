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

@Component({
  selector: 'app-data-component',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index implements OnInit {

  constructor(private http: Http, private router: Router, private roleService: RoleService, private toast: HotToastService, public lessonService: LessonService) { }

  readonly dialog = inject(MatDialog);

  clickLesson(element_id: any) {
    this.router.navigate([`/aula/${element_id}`]);
  }

  getAllLessons() {
    this.http.get("/aulas").subscribe({
      error: error => {
        if (error.error.message != null) {
          this.toast.error(error.error.message);
        }

        if (error.errror.redirect !== null) {
          this.router.navigate([error.error.redirect]);
        }
      }
    });
  }

  getYourLessons() {
    this.http.get("/aulas/ingressadas").subscribe({
      next: (return_api: ReturnApi) => {
        if (return_api.data != null) {
          return_api.data.map((yourLesson: any) => {
            let element = document.getElementById(yourLesson.id) as HTMLElement;
            element.dataset["join"] = "true";

            element = element.childNodes[0] as HTMLElement;

            element.classList.remove("status-no");
            element.classList.add("status-ok");
            element.innerHTML = "Inscrito";
          })
        }
      },
      error: error => {
        if (error.error.message != null) {
          this.toast.success(error.error.message);
        }
      }
    });
  }

  ngOnInit(): void {
    //this.getAllLessons();
  }
}
