import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Http } from '@src/app/service/http.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { RoleService } from '@src/app/service/role.service';
import { Router } from '@angular/router';
import { LessonService } from '@src/app/service/lesson.service';

@Component({
  selector: 'dialog-form',
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatDialogModule, CommonModule, MatFormFieldModule, MatInputModule, MatTimepickerModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './dialog-form.html',
  styleUrl: './dialog-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogForm{
  public url: string = "";
  public method: string = "";
  public title: string = "";
  public extra: { text: string, method: string, url: string } | undefined = undefined;
  public dialog: Array<{ label: string, name: string; type: string }> = [];
  public formValue: { [key: string]: any } = {};

  constructor(private http: Http, private router: Router, private lessonService: LessonService, private toast: HotToastService, @Inject(MAT_DIALOG_DATA) public data: any){
    this.dialog = this.data.dialog;
    this.method = this.data.method;
    this.url = this.data.url;
    this.title = this.data.title;
    this.extra = this.data.extra;
  }

  formSubmit(){
    if(this.formValue["time"] && this.formValue["date"]){
      const date = new Date(this.formValue["date"].getFullYear(), this.formValue["date"].getMonth(), this.formValue["date"].getDate(), this.formValue["time"].getHours(), this.formValue["time"].getMinutes());
      this.formValue["timestamp"] = Date.parse(date.toString());
    }

    if(this.method == "post"){
      this.http.post(this.url, this.formValue).subscribe({
        next: (return_api: ReturnApi) => {
          if(return_api?.message != null){
            this.toast.success(return_api.message);
          }

          if(return_api?.redirect != null){
            this.router.navigate([return_api.redirect]);
          }

          this.lessonService.getAllLessons();
          this.lessonService.getYourLessons();
        },
        error: (error) => {
          console.log(error);
          if(error.error.message != null){
            this.toast.error(error.error.message);
          }
        }
      });
    }
    else if(this.method == "put"){
      this.http.put(this.url, this.formValue).subscribe({
        next: (return_api: ReturnApi) => {
          if(return_api?.message != null){
            this.toast.success(return_api.message);
          }

          if(return_api?.redirect != null){
            this.router.navigate([return_api.redirect]);
          }

          this.lessonService.getAllLessons();
          this.lessonService.getYourLessons();
        },
        error: (error) => {
          console.log(error);
          if(error.error.message != null){
            this.toast.error(error.error.message);
          }
        }
      });
    }
  }

  actionExtra(){
    if(this.extra?.method == "delete"){
      this.http.delete(this.extra?.url).subscribe({
        next: (return_api: ReturnApi) => {
          if(return_api?.message != null){
            this.toast.success(return_api.message);
          }

          if(return_api?.redirect != null){
            this.router.navigate([return_api.redirect]);
          }

          this.lessonService.getAllLessons();
          this.lessonService.getYourLessons();
        },
        error: (error) => {
          console.log(error);
          if(error.error.message != null){
            this.toast.error(error.error.message);
          }
        }
      });
    }
    this.extra == undefined;
  }

  @Input() component!: any;
}