import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) { }
  createNotification(data) {
    return this.http.post(environment.endPoint + "/firebase/message", data);
  }
}
