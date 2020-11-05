import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  createAppointment(appointment){
    return this.http.post(environment.endPoint + "/appointments",  appointment, { observe: 'response' });
  }
  getAppointment(appointmentId){
    return this.http.get(environment.endPoint + "/appointments/" + appointmentId);
  }
  getAppointments(appointmentId){
    return this.http.get(environment.endPoint + "/appointments/"+ appointmentId +"/status");
  }

  

  getAppointmentStatus(cancelBody){
    return this.http.post(environment.endPoint + "/appointments/status", cancelBody);
  }

  initiateRefund(refund){
    return this.http.post(environment.endPoint + "/appointments/refund", refund, {observe: 'response'});
  }

  getAllAppointments(){
    return this.http.get(environment.endPoint + "/appointments");
  }

  getAppointmentsWithFilter(filters){
    return this.http.get(environment.endPoint + "/appointments", {params: filters});
  }
  

  getAppointmentsForADoc(doctorId: number, dates?: boolean){
    return this.http.post(environment.endPoint + "/appointments/doctor", 
    {
      doctor: doctorId, 
      dates: dates
    });
  }
  getBookingForADoc(doctorId: number, date?: any){
    return this.http.post(environment.endPoint + "/appointments/doctor", 
    {
      doctor: doctorId, 
      date:date
    });
  }

}
