import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { returnApi } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class Http {

  baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient){} 

  post(path: string = "/", body: any | null): Observable<returnApi>{
    return this.http.post<returnApi>(this.baseURL + path, JSON.stringify(body), { withCredentials: true });
  }

  get(path: string = "/"): Observable<returnApi>{
    return this.http.get<returnApi>(this.baseURL + path, { withCredentials: true });
  }
}