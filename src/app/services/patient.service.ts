import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }
 
  getPatient(patientId){
    return this.http.get(environment.endPoint + "/patients/" + patientId);
  }
  getPatients(){
    return this.http.get(environment.endPoint + "/patients");
  }

  getPatientDocuments(patientId){
    return this.http.get(environment.endPoint + "/documents/patient/" + patientId);
  }

  getPatientDocument(documentId){
    return this.http.get(environment.endPoint + "/documents/" + documentId, 
    {responseType:'arraybuffer', reportProgress:true, observe:'events' }
    );
  }

  getPatientAppointments(patientId){
    return this.http.get(environment.endPoint + "/appointments/patient/" + patientId);
  }

  updatePatients(patientId, patient){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.put(environment.endPoint + "/patients/" + patientId, patient, httpOptions);
  }
  
  searchPatients(q){
    return this.http.get(environment.endPoint + "/patients?q=" + q);
  }

  getPage(number){
    return this.http.get(environment.endPoint + "/patients?page=" + number);
  }
  addPatients(patient){
    return this.http.post(environment.endPoint + "/patients", patient,  {reportProgress: true, observe: 'events'});
  }
}
