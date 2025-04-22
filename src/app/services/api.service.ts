import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
  })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api';
  private token = environment.apiKey;

  constructor() {}

  get(endpoint: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${endpoint}`, {
      headers: {
        'X-API-KEY': this.token
      }
    });
  }

}