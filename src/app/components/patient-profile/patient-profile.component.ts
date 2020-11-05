import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CreateSlotDialogComponent } from 'src/app/components/create-slot-dialog/create-slot-dialog.component';
import { CreateApptmntDialogComponent } from './../create-apptmnt-dialog/create-apptmnt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import * as jwt_decode from 'jwt-decode';
import { HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit, OnDestroy {

  loadingProfile = true;
  loadingMedicalDoc = true;
  loadingAppointments = true;
  baseDownloadLink = environment.endPoint;

  patientId;
  patient = {
    name:'',
    phone:'',
    ref_id:'',
    dob:'',
    photo:'',
    gender:'',
    id:'',
    patient_appointments:[] = [],
    medical_documents: [] = []
  };
  role: any;
  progress = {
    completed: false
  }
  patAppSubscription = new Subscription();
  patDocSubscription = new Subscription();
  patSubscription = new Subscription();

  @ViewChild('viewDoc') viewDoc: ElementRef<HTMLAnchorElement>;

  constructor(private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cookie: CookieService,
     private patientService: PatientService) { }
  

  ngOnInit(): void {

    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];

    this.loadingProfile = true;
    this.patientId = this.activatedRoute.snapshot.paramMap.get('id');
    this.patSubscription = this.patientService.getPatient(this.patientId).subscribe(
      (res: any) => {
        this.patient = res.patient;
        this.patient.medical_documents = [];
        this.patient.patient_appointments = [];
        this.appointment();
        this.medical_documents();
        this.loadingProfile = false;
      },  
      err => {
        this.loadingProfile = false;
      }
    );
  
    $('[data-fancybox="gallery"]').fancybox();
  }

  appointment(){
    this.loadingAppointments = true;
    this.patAppSubscription = this.patientService.getPatientAppointments(this.patientId).subscribe(
      (res: any) => {
        this.patient.patient_appointments = res.appointments;
        this.loadingAppointments = false;
      },
      err => {
        this.patient.patient_appointments = [];
        this.loadingAppointments = false;
      }
    );
  }

  viewDocument(id){
    this.progress.completed = true;
    this.patientService.getPatientDocument(id).pipe(
      map((event: any) => {
        switch(event.type){
          case HttpEventType.DownloadProgress:
            let progress = Math.round(event.loaded * 100 / event.total);
            this.progress.completed = true;
            break;
          case HttpEventType.Response:
            this.downLoadFile(event.body, "image/jpg");
            this.progress.completed = false;
            return event;
        }
      }),
      catchError((err => {
        this.progress.completed = false;
        return 'Download Failed !';
      }))
    ).subscribe((res: any) => {
      // this.downLoadFile(res.body,);
    }, err => {
      console.log(err)
    });
  }
  
  private downLoadFile(data: any, type?: string) {
    let blob = new Blob([data], {type: type});
    let url = window.URL.createObjectURL(blob);

    const link = this.viewDoc.nativeElement;
    link.setAttribute("data-fancybox", "");
    $.fancybox.open([ {src  : url} ]);
  }
  medical_documents(){
    this.loadingMedicalDoc = true;
    this.patDocSubscription = this.patientService.getPatientDocuments(this.patientId).subscribe(
      (res: any) => {
        this.patient.medical_documents = res.documents;
        this.loadingMedicalDoc = false;
      },
      err => {
        this.patient.medical_documents = [];
        this.loadingMedicalDoc = false;
      }
    );
  }

  showDetails(data){
    this.dialog.open(CreateApptmntDialogComponent, {
      width: '700px',
      height: '600px',
      data: {appointment: {...data, patient:this.patient},from:'list'},
    });
  }

  editBasic(){
    this.dialog.open(CreateSlotDialogComponent, {
      width:'400px',
      id:'editPatient',
      disableClose: true,
      data: {patientId: this.patientId, pat: this.patient}
    });

    this.dialog.getDialogById('editPatient').afterClosed().subscribe((data) => {
      if(JSON.parse(data) != true)
        this.ngOnInit();
    });
  }
  ngOnDestroy(): void {
    this.patAppSubscription.unsubscribe();
    this.patDocSubscription.unsubscribe();
    this.patSubscription.unsubscribe();
  }
}
