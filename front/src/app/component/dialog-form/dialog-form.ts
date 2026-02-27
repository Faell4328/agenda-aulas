import { AfterViewInit, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
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
import { ReturnApi } from '@src/app/interfaces_types';

type DialogFormInput = {
  id: string;
  label: string;
  name: string;
  type: string;
  default?: string | null;
};

type DialogFormData = {
  url_req: string;
  method_req: 'post' | 'put';
  title: string;
  inputs: DialogFormInput[];
  runAfterSucess?: () => void;
};

@Component({
  selector: 'dialog-form',
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatDialogModule, CommonModule, MatFormFieldModule, MatInputModule, MatTimepickerModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './dialog-form.html',
  styleUrl: './dialog-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogForm implements AfterViewInit {
  public url_req: string = "";
  public method_req: 'post' | 'put' = 'post';
  public title: string = "";
  public inputs: DialogFormInput[] = [];
  private runAfterSucess: (() => void) | null = null;
  
  public form_value: { [key: string]: string | number } = {};
  private old_length_time: number = 0;
  private old_length_date: number = 0;

  constructor(private http: Http, private router: Router, private toast: HotToastService, @Inject(MAT_DIALOG_DATA) public data: DialogFormData) {
    this.url_req = this.data.url_req;
    this.method_req = this.data.method_req;
    this.title = this.data.title;
    this.inputs = this.data.inputs;
    this.runAfterSucess = this.data.runAfterSucess ?? null;
  }

  formSubmit() {
    if (this.form_value["time"] && this.form_value["date"]) {

      if (typeof(this.form_value["time"]) !== "string" || typeof(this.form_value["date"]) !== "string") {
        this.toast.error("Data e/ou hora está incorreta");
        return;
      }

      let date: string | string[] = this.form_value["date"].split("/");
      date = date[1] + "/" + date[0] + "/" + date[2];
      let timestamp = new Date(date + " " + this.form_value["time"]).toString();
      this.form_value["timestamp"] = Date.parse(timestamp);

      if (!this.form_value["timestamp"] || this.form_value["date"].length < 10 || this.form_value["time"].length < 5) {
        this.toast.error("Data e/ou hora está incorreta");
        return;
      }

    }
    else {
      this.toast.error("Não foi enviado a data e/ou hora");
      return;
    }

    if (this.method_req === "post") {
      this.http.post<null>(this.url_req, this.form_value).subscribe({
        next: (return_api: ReturnApi<null>) => {
          if (return_api?.message != null) {
            this.toast.success(return_api.message);
          }

          if (return_api?.redirect != null) {
            this.router.navigate([return_api.redirect]);
          }

          if (this.runAfterSucess) {
            this.runAfterSucess();
          }
        },
        error: (error) => {
          if (error.error.message != null) {
            this.toast.error(error.error.message);
          }
        }
      });
    }
    else if (this.method_req === "put") {
      this.http.put<null>(this.url_req, this.form_value).subscribe({
        next: (return_api: ReturnApi<null>) => {
          if (return_api?.message != null) {
            this.toast.success(return_api.message);
          }

          if (return_api?.redirect != null) {
            this.router.navigate([return_api.redirect]);
          }

          if (this.runAfterSucess) {
            this.runAfterSucess();
          }
        },
        error: (error) => {
          if (error.error.message != null) {
            this.toast.error(error.error.message);
          }
        }
      });
    }
  }

  private controller_date_notification = false;
  formatDate(element_id: string) {
    const input: HTMLInputElement | null = document.getElementById(element_id) as HTMLInputElement | null;
    const value: string | null = input?.value ?? null;
    
    if (input == null || value == null) {
      return;
    }

    if(value.split("").filter(char =>{
      return char != "0" && char != "1" && char != "2" && char != "3" && char != "4" && char != "5" && char != "6" && char != "7" && char != "8" && char != "9" && char != "/";
    }).length > 0) {
      if (!this.controller_date_notification) {
        this.toast.error("Data está com formatação incorreta");
        this.controller_date_notification = true;
      }
    }
    
    if ((this.old_length_date < value.length) && (value.length === 2 || value.length === 5)) {
      input.value = value + "/";
    }
    else if (value.length === 3 && value[2] !== "/") {
      let new_value = value.split("");
      input.value = `${new_value[0]}${new_value[1]}/${new_value[2]}`;
    }
    else if (value.length === 6 && value[5] !== "/") {
      let new_value = value.split("");
      input.value = `${new_value[0]}${new_value[1]}/${new_value[2]}${new_value[3]}/${new_value[4]}${new_value[5]}`;
    }

    this.old_length_date = input.value.length;
  }

  private controller_time_notification = false;
  formatTime(element_id: string) {
    const input: HTMLInputElement | null = document.getElementById(element_id) as HTMLInputElement | null;
    const value: string | null = input?.value ?? null;
    
    if (input == null || value == null) {
      return;
    }

    if(value.split("").filter(char =>{
      return char != "0" && char != "1" && char != "2" && char != "3" && char != "4" && char != "5" && char != "6" && char != "7" && char != "8" && char != "9" && char != ":";
    }).length > 0) {
      if (!this.controller_time_notification) {
        this.toast.error("Hora está com formatação incorreta");
        this.controller_time_notification = true;
      }
    }

    if ((this.old_length_time < value.length) && (value.length === 2)) {
      input.value = value + ":";
    }
    else if (value.length === 3 && value[2] !== ":") {
      let new_value = value.split("");
      input.value = `${new_value[0]}${new_value[1]}:${new_value[2]}`;
    }

    this.old_length_time = input.value.length;
  }

  ngAfterViewInit() {
    let inputs = [...this.inputs];
    inputs = inputs.reverse();
    inputs.forEach(input => {
      if (input.default) {
        this.form_value[input.name] = input.default;
      }
    });
  }
}
