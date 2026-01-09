import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'dialog-form',
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatDialogModule, CommonModule, MatFormFieldModule, MatInputModule, MatTimepickerModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './dialog-form.html',
  styleUrl: './dialog-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogForm implements AfterViewInit {
  public url: string = "";
  public method: string = "";
  public title: string = "";
  public dialog: Array<{ id: string, label: string, name: string; type: string, default: string | null }> = [];
  public formValue: { [key: string]: any } = {};
  private oldLengthTime: number = 0;
  private oldLengthDate: number = 0;
  private runAfterSucess: any = null;

  constructor(private http: Http, private router: Router, private toast: HotToastService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialog = this.data.dialog;
    this.method = this.data.method;
    this.url = this.data.url;
    this.title = this.data.title;
    this.runAfterSucess = this.data.runAfterSucess;
  }

  formSubmit() {
    if (this.formValue["time"] && this.formValue["date"]) {
      let date = this.formValue["date"].split("/");
      date = date[1] + "/" + date[0] + "/" + date[2];
      date = new Date(date + " " + this.formValue["time"]);
      this.formValue["timestamp"] = Date.parse(date.toString());

      if (!this.formValue["timestamp"] || this.formValue["date"].length < 10 || this.formValue["time"].length < 5) {
        this.toast.error("Data e/ou hora estão inválidos");
        return;
      }
      console.error("O foi ajustado para: ")
      console.error(this.formValue["timestamp"]);
    }
    else {
      this.toast.error("Não foi enviado a data e/ou hora");
    }

    if (this.method == "post") {
      this.http.post(this.url, this.formValue).subscribe({
        next: (return_api: ReturnApi) => {
          if (return_api?.message != null) {
            this.toast.success(return_api.message);
          }

          if (return_api?.redirect != null) {
            this.router.navigate([return_api.redirect]);
          }

          this.runAfterSucess();
        },
        error: (error) => {
          console.log(error);
          if (error.error.message != null) {
            this.toast.error(error.error.message);
          }
        }
      });
    }
    else if (this.method == "put") {
      this.http.put(this.url, this.formValue).subscribe({
        next: (return_api: ReturnApi) => {
          if (return_api?.message != null) {
            this.toast.success(return_api.message);
          }

          if (return_api?.redirect != null) {
            this.router.navigate([return_api.redirect]);
          }

          this.runAfterSucess();
        },
        error: (error) => {
          console.log(error);
          if (error.error.message != null) {
            this.toast.error(error.error.message);
          }
        }
      });
    }
  }

  correctDate(nameElement: string) {
    const element: any = document.getElementById(nameElement);
    const value: string | null = element.value;

    if (!value) {
      return;
    }

    if ((this.oldLengthDate < value?.length) && (value?.length == 2 || value?.length == 5)) {
      element.value = value + "/";
    }
    else if (value.length == 3 && value[2] != "/") {
      let newValue = value.split("");
      element.value = `${newValue[0]}${newValue[1]}/${newValue[2]}`;
    }
    else if (value.length == 6 && value[5] != "/") {
      let newValue = value.split("");
      element.value = `${newValue[0]}${newValue[1]}${newValue[2]}${newValue[3]}${newValue[4]}/${newValue[4]}`;
    }

    this.oldLengthDate = value.length;
  }

  correctTime(nameElement: string) {
    console.log("Chamou time");
    const element: any = document.getElementById(nameElement);
    const value: string | null = element.value;

    if (!value) {
      return;
    }

    console.log(value?.length);
    console.log(this.oldLengthTime)

    if ((this.oldLengthTime < value?.length) && (value?.length == 2)) {
      element.value = value + ":";
    }
    else if (value.length == 3 && value[2] != ":") {
      let newValue = value.split("");
      element.value = `${newValue[0]}${newValue[1]}:${newValue[2]}`;
    }

    this.oldLengthTime = value.length;
  }

  @Input() component!: any;

  ngAfterViewInit() {
    let elements = [...this.dialog];
    elements = elements.reverse();
    elements.forEach(element => {
      this.formValue[element.name] = element.default;
    })
  }
}
