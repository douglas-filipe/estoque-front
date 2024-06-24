import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlLogin = apiUrl + '/auth/login';
  private urlSignup = apiUrl + '/user';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.urlLogin, { email, password });
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(this.urlSignup, { name, email, password });
  }
}
