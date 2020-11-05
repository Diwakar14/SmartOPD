import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  constructor(private http: HttpClient) { }

  newAdmission(patient){
    return this.http.post(environment.endPoint + '/instant/appointments', patient);
  }
  getAdmissions(params){
    return this.http.get(environment.endPoint + '/instant/appointments', {params: params});
  }
  getAdmission(appointmentId){
    return this.http.get(environment.endPoint + '/instant/appointments/' + appointmentId);
  }
}
