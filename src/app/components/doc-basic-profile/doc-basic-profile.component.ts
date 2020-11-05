import { ActivateDoctorDialogComponent } from './../activate-doctor-dialog/activate-doctor-dialog.component';
import { StateService } from './../../services/state.service';
import { DelDocDialogComponent } from './../del-doc-dialog/del-doc-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { EditDocDialogComponent } from './../edit-doc-dialog/edit-doc-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-doc-basic-profile',
  templateUrl: './doc-basic-profile.component.html',
  styleUrls: ['./doc-basic-profile.component.scss']
})
export class DocBasicProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  doctor;
  loading = true;

  specializations = [];
  qualifications = [];
  poll: any;
  role;

  @Input() doctorId;
  @Input() doctorData;
  @Output() change = new EventEmitter();
  
  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private cookie: CookieService,
    private stateService: StateService
    ) { }

  ngOnDestroy(): void {
    clearInterval(this.poll);
  }
  ngAfterViewInit(): void {
    this.poll = setInterval(() => {
        this.ngOnInit()
    }, 5000);
  }

  ngOnInit(): void {
    if(this.doctorData){
      this.loading = false;
    }
    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];
    this.doctor = this.doctorData.doctor;
    this.specializations = this.doctorData.doctor.doctor_detail.specializations;
    this.qualifications = this.doctorData.doctor.doctor_detail.qualifications;
    if(this.doctorData.doctor.doctor_detail.toBeDeleted){
      this.stateService.updateApprovalDelDocMessage(true);
    }else{
      this.stateService.updateApprovalDelDocMessage(false);
    }
  }


  editBasic(){
    this.dialog.open(EditDocDialogComponent, {
      width: '400px',
      id:'editBasic',
      disableClose: true,
      data: {origin: 'editBasic', docId: this.doctorId, doctorBasic: this.doctor}
    });
    this.dialog.getDialogById('editBasic').afterClosed().subscribe((data) => {
      if(JSON.parse(data) != true)
        this.change.emit({reload:true})
    })
  }
  editMedical(){
    this.dialog.open(EditDocDialogComponent, {
      width: '400px',
      id:'editMedical',
      disableClose: true,
      data: {origin: 'editMedical', docId: this.doctorId, doctorMedical: this.doctor}
    });
    this.dialog.getDialogById('editMedical').afterClosed().subscribe((data) => {
      if(JSON.parse(data) != true)
        this.change.emit({reload:true})
    })
  }
  editContact(){
    this.dialog.open(EditDocDialogComponent, {
      width: '400px',
      id:'editContact',
      disableClose: true,
      data: {origin: 'editContact', docId: this.doctorId, doctorContact: this.doctor}
    });
    this.dialog.getDialogById('editContact').afterClosed().subscribe((data) => {
      if(JSON.parse(data) != true)
        this.change.emit({reload:true})
    })
  }

  delDoc(){
    this.dialog.open(DelDocDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {doc: this.doctorId},
      id: 'del-doc'
    });
  }
  deactivateDoc(type){
    this.dialog.open(ActivateDoctorDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {doc: this.doctorId, type: type},
      id: 'deactivate-doc'
    });
    this.dialog.getDialogById('deactivate-doc').afterClosed().subscribe((data) => {
      if(data.success){
        this.change.emit({reload:true})
      }
    })
  }
  

}
