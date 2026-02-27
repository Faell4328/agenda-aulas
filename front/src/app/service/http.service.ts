import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnApi } from '../interfaces_types';

@Injectable({
  providedIn: 'root'
})

export class Http {

  baseURL: string = 'http://192.168.100.117:8080';

  constructor(private http: HttpClient){} 

  get<T>(path: string = "/"): Observable<ReturnApi<T>>{
    return this.http.get<ReturnApi<T>>(this.baseURL + path, { withCredentials: true });
  }
  
  post<T>(path: string = "/", body: any | null): Observable<ReturnApi<T>>{
    return this.http.post<ReturnApi<T>>(this.baseURL + path, JSON.stringify(body), { withCredentials: true });
  }

  put<T>(path: string = "/", body: any | null): Observable<ReturnApi<T>>{
    return this.http.put<ReturnApi<T>>(this.baseURL + path, JSON.stringify(body), { withCredentials: true });
  }

  delete<T>(path: string = "/"): Observable<ReturnApi<T>>{
    return this.http.delete<ReturnApi<T>>(this.baseURL + path, { withCredentials: true });
  }
}