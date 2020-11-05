import { CreateSlotDialogComponent } from './../create-slot-dialog/create-slot-dialog.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { take, debounceTime, distinctUntilChanged, map, tap, switchMap, catchError } from 'rxjs/operators';
import { AdmissionService } from 'src/app/services/admission.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from 'src/app/services/patient.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Subscription, fromEvent, of } from 'rxjs';
declare var Notiflix:any;
declare var $: any;

@Component({
  selector: 'app-admit',
  templateUrl: './admit.component.html',
  styleUrls: ['./admit.component.scss']
})
export class AdmitComponent implements OnInit, AfterViewInit, OnDestroy {
  loadingSearchDataDoc: boolean;
  loadingSearchDataPat: boolean;
  loading: boolean;
  filteredDoctors = [];
  filteredPatient = [];
  selectedDocCard = {
    photo: null,
    name: '',
    designation: '',
    isSelected: false
  }
  selectedPatCard = {
    photo: null,
    name: '',
    phone: '',
    isSelected: false
  }
  step1 = true;
  step2 = true;
  
  blocker = {
    slot: true,
    confirm: true
  }

  info = {
    doctor: true,
    patient: true,
    slot: true,
    date: true
  }
  doctor;
  patient;
  doctorId: any;
  confirm: boolean;
  consultation_fees: any;
  confirmBooking: any;
  offline_fees: any;

  searchDocSubscription = new Subscription();
  searchPatSubscription = new Subscription();
  
  @ViewChild('searchDoctor') searchDoctor:ElementRef;
  @ViewChild('searchPatientAdmit') searchPatientAdmit:ElementRef;

  constructor(
    private admissionService: AdmissionService,
    public dialog: MatDialog,
    private patientService: PatientService,
    private doctorService: DoctorService) { }
  

  ngAfterViewInit(): void {
    this.searchDocSubscription = fromEvent(this.searchDoctor.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        map((event: Event) => {
          return (<HTMLInputElement>event.target).value
        }),
        tap(() => {
          this.loadingSearchDataDoc = true;
        }),
        switchMap(value => this.doctorService.searchDoctors(value).pipe(catchError(err => of({data:[]}))))
      ).subscribe((res: any) => {
        this.filteredDoctors = res.data;
        this.loadingSearchDataDoc = false;
      }, err => {
        this.filteredDoctors = [];
        this.loadingSearchDataDoc = false;
      }
    );
    this.searchPatSubscription = fromEvent(this.searchPatientAdmit.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        map((event: Event) => {
          return (<HTMLInputElement>event.target).value
        }),
        tap(() => {
          this.loadingSearchDataPat = true;
        }),
        switchMap(value => this.patientService.searchPatients(value).pipe(catchError(err => of({data:{data:[]}}))))
      ).subscribe((res: any) => {
        this.filteredPatient = res.data.data;
        this.loadingSearchDataPat = false;
      }, err => {
        this.filteredPatient = [];
        this.loadingSearchDataPat = false;
      }
    );
  }

  ngOnInit(): void {
      
  }

  
  selectPatient(patient){
    this.filteredPatient = [];
    this.patient = patient;
    this.selectedPatCard = patient;
    this.selectedPatCard.isSelected = true;

    if(this.selectedDocCard.isSelected){
      this.blocker.confirm = false;
    }
    
    this.info.patient = false;
    $('#searchPat2').val('');
  }

  selectCard(data){
    this.filteredDoctors = [];
    this.doctor = data;
  
    this.selectedDocCard.designation = data.designation;
    this.selectedDocCard.photo = data.doctor.photo;
    this.selectedDocCard.name = data.doctor.name;
    this.selectedDocCard.isSelected = true;
    this.doctorId = data.doctor_id;
    this.doctorService.getDoctor(this.doctorId).pipe(take(1)).subscribe(
      (res: any) => {
        this.offline_fees = res.doctor.doctor_detail.offline_fees;
      }
    )
    if(this.selectedPatCard.isSelected){
      this.blocker.confirm = false;
    }

    this.info.doctor = false;
    this.step2 = false;
    $('#searchDoc').val('');
  }

  addPatient(){
    this.dialog.open(CreateSlotDialogComponent, {
      width: '450px',
      data: {origin: 'admission', type: 'create'},
      id: 'createPatient',
      disableClose: true
    });

    this.dialog.getDialogById('createPatient').afterClosed().subscribe(
      (data: any) => {
        console.log(data);
        if(data.patient !=null || data.patient != undefined)
          this.selectPatient(data.patient);
      }
    )
  }

  confirmBook(){
    this.confirm = true;
    let app = {
      doctor: this.doctorId,
      patient: this.patient.id,
      offline_payment: true
    }
    this.admissionService.newAdmission(app).pipe(take(1)).subscribe(
      (res: any) => {
        this.admissionService.getAdmission(res.appointment.id).pipe(take(1)).subscribe((res: any) => {
          
          this.confirmBooking = res.appointment;
          this.consultation_fees = res.appointment.payment.amount;
          this.confirm = false;
          setTimeout(() => {
            this.print();
          }, 1000);

        },err => {
          Notiflix.Notify.Failure(err.error.message);
        });
        
        this.blocker.slot = true;
        this.blocker.confirm = true;

        this.info.doctor = true;
        this.info.patient = true;

        this.step2 = true;

        this.selectedDocCard.isSelected = false;
        this.selectedPatCard.isSelected = false;

        $('#searchDoc').val('');
        $('#searchPat').val('');

      },
      err => {
        this.confirm = false;
        Notiflix.Notify.Failure(err.error.message)
      }
    )
  }
  print() {
    var data = document.getElementById('contentToConvertFromApp');  
    var WinPrint = window.open('', '', 'width=793,height=650');
    WinPrint.document.write(data.innerHTML);
    this.confirmBooking = null;
    this.consultation_fees = null;
  
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();

    setTimeout(() => {
      WinPrint.close();
    }, 2000);
  }
  
  ngOnDestroy(): void {
    this.searchDocSubscription.unsubscribe();
    this.searchPatSubscription.unsubscribe();
  }
}
