import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Login } from './../models/login.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(login: Login){
    return this.http.post(environment.endPoint + "/auth/login/phone",  login);
  }

  uniquePhone(phoneNo: any){
    return this.http.post(environment.endPoint + "/auth/unique/phone",  phoneNo);
  }

  loginWithEmail(login){
    return this.http.post(environment.endPoint + "/auth/login/username", login, { observe: 'response' });
  }

  verifyLogin(login: Login){
    return this.http.post(environment.endPoint + "/auth/login/phone/validate", login, { observe:'response' });
  }

  logOut(){
    return this.http.post(environment.endPoint + "/auth/logout", null);
  }
}
