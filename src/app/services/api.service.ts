import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';
  private token = 'todo';

  constructor() {}

  get(endpoint: string): Observable<any> {
    /*
    headers: {
        'Authorization': 'Bearer '+this.token
      }
        */
    return this.http.get<any[]>(`${this.apiUrl}/${endpoint}`);
  }

}