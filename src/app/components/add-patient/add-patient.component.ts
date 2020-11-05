import { Router } from '@angular/router';
import { Patient } from './../../models/patient';
import { PatientService } from './../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
declare var Notiflix:any;
declare var $: any;


@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {

  patient:Patient = new Patient();
  saving: boolean;
  progress = {
    width:'',
    complete: false
  };
  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {

  }
  checkPhone(){
    if(this.patient.isWhatsAppNoSameAsPhone){
      this.patient.whatsapp_number = this.patient.phone;
    }
  }
  addPatient(f: NgForm){
    this.saving = true;
    let dob;
    let patientData = new FormData();
    if(this.patient.dob){
      dob = this.patient.dob.getFullYear()+'-'+this.patient.dob.getMonth()+'-'+this.patient.dob.getDate()
    }else{
      dob = '';
    }
  
    patientData.append('name', this.patient.name);
    patientData.append('dob', dob);
    patientData.append('phone', this.patient.phone);
    patientData.append('gender', this.patient.gender);
    patientData.append('whatsapp_number', this.patient.whatsapp_number);
    patientData.append('blood_group', this.patient.blood_group);
    
    this.patientService.addPatients(patientData).pipe(
      map(event => {
        switch(event.type){
          case HttpEventType.UploadProgress:
            let progress = Math.round(event.loaded * 100 / event.total);
            this.progress.width = progress+'%';
            this.progress.complete = true;
            break;
          case HttpEventType.Response:
            console.log("Patients Added");
            Notiflix.Notify.Success("Patients Added !");
            this.router.navigate(['/dashboard/patients']);
            this.progress.complete = false;
            return event;
        }
      }),
      catchError((err => {
        Notiflix.Notify.Failure(err.error.message);
        this.saving = false;
        return 'Upload Failed!!!';
      }))
    ).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
         console.log("Something")
        }  
      }
    );
   
  }

}
