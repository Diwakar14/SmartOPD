import { ConfirmSendNoticeDialogComponent } from 'src/app/components/confirm-send-notice-dialog/confirm-send-notice-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from './../../services/NotificationService';
import { NgForm } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { DepartmentService } from 'src/app/services/department.service';
declare var Notiflix: any;
declare var $: any;
declare var Tagify: any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit {

  doctorList = [];
  loading: boolean;
  search_field: any;
  filteredDoctors = [];
  filteredPatients = [];
  filteredDepartments = [];

  Doctors = [];
  Patients = [];
  Departments = [];
  loadingSearchDataDoc = false;
  loadingSearchDataPat = false;
  loadingSearchDataDept = false;

  general = {
    title: '',
    body: '',
    recipient: '',
    submit: false
  }
  docNotification = {
    title: '',
    body: '',
    recipient: '',
    doctors: [] = [],
    all: 'All Doctors',
    submit: false
  }
  patNotification = {
    title: '',
    body: '',
    recipient: '',
    patients: [] = [],
    all: 'All Patients',
    submit: false
  }
  deptNotification = {
    title: '',
    body: '',
    recipient: '',
    departments: [] = [],
    all: 'All Departments',
    submit: false
  }
  doctors: any;
  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  @ViewChild('photo1') photo1: ElementRef;
  @ViewChild('photo2') photo2: ElementRef;
  @ViewChild('photo3') photo3: ElementRef;
  @ViewChild('photo4') photo4: ElementRef;

  ngAfterViewInit(): void {
  }

  ngAfterContentInit(): void {

  }

  fileChangeEvent(data) {

  }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe((res: any) => {
      this.doctorList = res.doctors;
    })

    $(document).ready(function () {
      $.uploadPreview({
        input_field: "#image-upload1",   // Default: .image-upload
        preview_box: "#image-preview1",  // Default: .image-preview
        label_field: "#image-label1",    // Default: .image-label
        label_default: "Choose Image",   // Default: Choose File
        label_selected: "Change Image",  // Default: Change File
        no_label: false                 // Default: false
      });
      $.uploadPreview({
        input_field: "#image-upload2",   // Default: .image-upload
        preview_box: "#image-preview2",  // Default: .image-preview
        label_field: "#image-label2",    // Default: .image-label
        label_default: "Choose Image",   // Default: Choose File
        label_selected: "Change Image",  // Default: Change File
        no_label: false                 // Default: false
      });
      $.uploadPreview({
        input_field: "#image-upload3",   // Default: .image-upload
        preview_box: "#image-preview3",  // Default: .image-preview
        label_field: "#image-label3",    // Default: .image-label
        label_default: "Choose Image",   // Default: Choose File
        label_selected: "Change Image",  // Default: Change File
        no_label: false                 // Default: false
      });
      $.uploadPreview({
        input_field: "#image-upload4",   // Default: .image-upload
        preview_box: "#image-preview4",  // Default: .image-preview
        label_field: "#image-label4",    // Default: .image-label
        label_default: "Choose Image",   // Default: Choose File
        label_selected: "Change Image",  // Default: Change File
        no_label: false                 // Default: false
      });
    });
  }


  searchDoc(searchData) {
    this.loadingSearchDataDoc = true;
    this.filteredDoctors = [];
    let data = searchData.target.value.toLowerCase();
    this.doctorService.searchDoctors(data).pipe(
      debounceTime(2000),
    ).subscribe(
      (res: any) => {
        this.doctors = res.data;
        this.filteredDoctors = this.doctors;
        this.loadingSearchDataDoc = false;
      },
      err => {
        this.loadingSearchDataDoc = false;
      }
    )
  }
  searchPat(searchData) {
    this.loadingSearchDataPat = true;
    let data = searchData.target.value.toLowerCase();
    this.patientService.searchPatients(data).pipe(
      debounceTime(1000),
    ).subscribe(
      (res: any) => {
        // console.log(res);
        this.filteredPatients = res.data.data;
        this.loadingSearchDataPat = false;
      }
    );
    // console.log(this.filteredPatients);
  }


  searchDept(searchData) {
    this.loadingSearchDataDept = true;
    let data = searchData.target.value.toLowerCase();
    this.departmentService.searchDepartment(data).pipe(
      debounceTime(1000),
    ).subscribe(
      (res: any) => {
        // console.log(res);
        this.filteredDepartments = res.departments;
        this.loadingSearchDataDept = false;
      }
    );
    // console.log(this.filteredDepartments);
  }

  addDoc(data, i) {
    let doc = this.Doctors.find(i => i.doctor.name == data.doctor.name);
    if (!doc)
      this.Doctors.push(data);

    this.filteredDoctors = [];
  }
  deleteChipDoc(index) {
    this.Doctors.splice(index, 1);
  }


  addPat(data, i) {
    let pat = this.Patients.find(i => i.name == data.name);
    if (!pat)
      this.Patients.push(data);
    this.filteredPatients = [];
  }
  deleteChipPat(index) {
    this.Patients.splice(index, 1);
  }


  addDepartment(data, i) {
    let dept = this.Departments.find(i => i.name == data.name);

    if (!dept)
      this.Departments.push(data);
    this.filteredDepartments = [];
  }
  deleteChipDepartment(index) {
    this.Departments.splice(index, 1);
  }


  generalNot(f: NgForm) {
    let confirm = false;
    let generalFormData = new FormData();
    generalFormData.append("title", this.general.title);
    generalFormData.append("body", this.general.body);
    generalFormData.append("recipient", 'General');

    if (this.photo1.nativeElement.files.length != 0) {
      generalFormData.append('photo', this.photo1.nativeElement.files[0])
    }
    this.dialog.open(ConfirmSendNoticeDialogComponent, {
      width: '400px',
      id: 'gen',
      disableClose: true,
      data: { title: this.general.title, message: this.general.body, origin: 'gen' }
    });
    this.dialog.getDialogById('gen').afterClosed().subscribe((data: any) => {
      confirm = data.confirm;
      if (confirm) {
        this.general.submit = true;
        this.notificationService.createNotification(generalFormData).subscribe(
          res => {
            Notiflix.Notify.Success("Notification Sent !");
            this.general.submit = false;
            // f.reset(this.general);
            this.general.title = '';
            this.general.body = '';
          },
          err => {
            // console.log(err);
            Notiflix.Notify.Failure(err.error.message);
            this.general.submit = false;
          }
        )
      } else {
        this.general.submit = false;
      }
    });



  }
  doctorNot(f: NgForm) {
    let confirm = false;
    let doctorForm = new FormData();
    doctorForm.append("title", this.docNotification.title);
    doctorForm.append("body", this.docNotification.body);
    doctorForm.append("recipient", 'Doctor');
    if (this.docNotification.all == 'Specific Doctor')
      doctorForm.append("doctors", JSON.stringify(this.Doctors.map(i => i.doctor_id)));

    if (this.photo1.nativeElement.files.length != 0) {
      doctorForm.append('photo', this.photo1.nativeElement.files[0]);
    }
    this.dialog.open(ConfirmSendNoticeDialogComponent, {
      width: '400px',
      id: 'doc',
      disableClose: true,
      data: { title: this.docNotification.title, message: this.docNotification.body, origin: 'doc' }
    });
    this.dialog.getDialogById('doc').afterClosed().subscribe((data: any) => {
      confirm = data.confirm;
      if (confirm) {
        this.docNotification.submit = true;
        this.notificationService.createNotification(doctorForm).subscribe(
          res => {
            Notiflix.Notify.Success("Notification Sent !");
            this.docNotification.submit = false;
            this.Doctors = [];
            this.docNotification.title = '';
            this.docNotification.body = '';
            this.deptNotification.all = 'All Doctors';

            // f.resetForm(this.docNotification);
          },
          err => {
            // console.log(err);
            Notiflix.Notify.Failure(err.error.message);
            this.docNotification.submit = false;

          }
        )
      } else {
        this.docNotification.submit = false
      }
    });




  }
  patientNot(f: NgForm) {
    let confirm = false;
    console.log(this.patNotification);

    let generalFormData = new FormData();
    generalFormData.append("title", this.patNotification.title);
    generalFormData.append("body", this.patNotification.body);
    generalFormData.append("recipient", 'Patient');
    if (this.patNotification.all == 'Specific Patient')
      generalFormData.append("patients", JSON.stringify(this.Patients.map(i => i.id)));

    if (this.photo1.nativeElement.files.length != 0) {
      generalFormData.append('photo', this.photo3.nativeElement.files[0]);
    }

    this.dialog.open(ConfirmSendNoticeDialogComponent, {
      width: '400px',
      id: 'pat',
      disableClose: true,
      data: { title: this.patNotification.title, message: this.patNotification.body, origin: 'pat' }
    });
    this.dialog.getDialogById('pat').afterClosed().subscribe((data: any) => {
      confirm = data.confirm;
      if (confirm) {
        this.patNotification.submit = true;
        this.notificationService.createNotification(generalFormData).subscribe(
          res => {
            Notiflix.Notify.Success("Notification Sent !");
            this.patNotification.submit = false;
            this.Patients = [];
            this.patNotification.title = '';
            this.patNotification.body = '';
            this.deptNotification.all = 'All Patients';

            // f.reset(this.patNotification);
          },
          err => {
            // console.log(err);
            Notiflix.Notify.Failure(err.error.message);
            this.patNotification.submit = false;
          }
        )
      } else {
        this.patNotification.submit = false

      }
    });


  }
  departmentNot(f: NgForm) {
    let confirm = false;
    let generalFormData = new FormData();
    generalFormData.append("title", this.deptNotification.title);
    generalFormData.append("body", this.deptNotification.body);
    generalFormData.append("recipient", "Department");
    if (this.deptNotification.all == 'Specific Department')
      generalFormData.append("departments", JSON.stringify(this.Departments.map(i => i.id)));

    if (this.photo1.nativeElement.files.length != 0) {
      generalFormData.append('photo', this.photo4.nativeElement.files[0])
    }
    this.dialog.open(ConfirmSendNoticeDialogComponent, {
      width: '400px',
      id: 'dept',
      disableClose: true,
      data: { title: this.deptNotification.title, message: this.deptNotification.body, origin: 'dept' }
    });
    this.dialog.getDialogById('dept').afterClosed().subscribe((data: any) => {
      confirm = data.confirm;
      if (confirm) {
        this.deptNotification.submit = true;
        this.notificationService.createNotification(generalFormData).subscribe(
          res => {
            Notiflix.Notify.Success("Notification Sent !");
            this.deptNotification.submit = false;
            this.Departments = [];
            this.deptNotification.title = '';
            this.deptNotification.body = '';
            this.deptNotification.all = 'All Departments';
            // f.reset(this.deptNotification);
          },
          err => {
            // console.log(err);
            Notiflix.Notify.Failure(err.error.message);
            this.deptNotification.submit = false;

          }
        )
      } else {
        this.deptNotification.submit = false;
      }
    });



  }


}

