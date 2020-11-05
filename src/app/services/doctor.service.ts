import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }
  
  getDoctor(doctorId){
    return this.http.get(environment.endPoint + "/doctors/" + doctorId);
  }
  getDoctors(){
    return this.http.get(environment.endPoint + "/doctors");
  }
  searchDoctors(q){
    return this.http.get(environment.endPoint + "/doctors?q=" + q);
  }

  updateDoc(doctorId, doctor){
    return this.http.put(environment.endPoint + "/doctors/" + doctorId, doctor, {observe: 'response'});
  }
  updateDocStatus(doctorId, status){
    return this.http.put(environment.endPoint + "/doctors/" + doctorId + "/status", status, {observe: 'response'});
  }

  uploadDocPhoto(doctorId, photo){
    return this.http.post(environment.endPoint + "/doctors/" + doctorId + '/photo', photo, {reportProgress: true, observe: 'events'});
  }


  addBasicInfo(doctor){
    return this.http.post(environment.endPoint + "/doctors", doctor, {reportProgress: true, observe: 'events'});
  }
  addMedicalInfo(doctor, docId){
    return this.http.post(environment.endPoint + "/doctors/"+docId+"/more", doctor, {reportProgress: true, observe: 'events'});
  }
  addContactInfo(doctor, docId){
    return this.http.post(environment.endPoint + "/doctors/"+docId+"/contact", doctor, {reportProgress: true, observe: 'events'});
  }


  deleteDoctor(doctorId: number, password?: string){
    if(password != null)
      return this.http.delete(environment.endPoint + "/doctors/" + doctorId + "?password=" + password, {observe: 'response'});
    return this.http.delete(environment.endPoint + "/doctors/" + doctorId, {observe: 'response'});
  }
}
