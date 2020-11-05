import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get(environment.endPoint + "/staff");
  }

  getStaff(id){
    return this.http.get(environment.endPoint + "/staff/" + id);
  }

  searchStaff(q){
    return this.http.get(environment.endPoint + "/staff?q="+q);
  }

  updateStaff(id, staff){
    return this.http.put(environment.endPoint + "/staff/"+ id, staff);
  }

  getPage(page){
    return this.http.get(environment.endPoint + "/staff?page="+page);
  }
  
  createUser(users){
    return this.http.post(environment.endPoint + "/staff", users, {observe: 'response'});
  }
  
}
