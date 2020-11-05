import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';
import { DoctorService } from './../../services/doctor.service';
import { Doctor } from './../../models/doctor.model';
import { DepartmentService } from './../../services/department.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators, NgModel } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { MatChipInputEvent} from '@angular/material/chips';
import { Observable} from 'rxjs';
import { map, startWith, catchError} from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpEventType } from '@angular/common/http';
declare var Notiflix:any;
declare var $: any;
declare var Tagify: any;

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})

export class AddDoctorComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  saving = false;

  phoneUniqueErrors = false;
  phoneUniqueErrorsMessage = '';

  progress = {
    width:'',
    complete: false
  };


  basicInfo = {
    name: '',
    dob:'',
    gender:'',
    designation: '',
    department:'',
    blood_group:'',
    online_fees:'',
    offline_fees:''
  };

  medicalInfo = {
    doctor:'',
    specializations: [],
    qualifications:[],
    experience:''
  }

  contactInfo = {
    doctor:'',
    phone:'',
    whatsapp_number:'',
    add1:'',
    add2:'',
    city:'',
    country:'',
    email:'',
    isPhone: false
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  photoPreview;
    
  dept = new FormControl();
  gender = new FormControl();
  departments: string[];
  doctor: Doctor = new Doctor();

  doctorId;

  submit = false;

  disableMedical = true;  
  disableContact = true;  

  loadingInfo = false;
  loadingMedical = false;
  loadingContact = false;

  specializations: string[] = [];
  qualifications: string[] = [];

  @ViewChild('photo') photo: ElementRef<HTMLInputElement>;
  crop: boolean = false;
  img: any;

  constructor(private departmentService: DepartmentService, 
    private router: Router,
    private authService: AuthService,
    private stateSrevice: StateService,
    private sanitize: DomSanitizer,
    private doctorService: DoctorService) 
  {
    this.doctorId = localStorage.getItem('docId');
    this.photoPreview = this.sanitize.bypassSecurityTrustStyle("url('../../../assets/icons/favIcon.png') center no-repeat")
  }

  ngOnInit(): void {
    this.departmentService.getDepartment(true).subscribe((dept:any) => {
      this.departments = dept.departments
    });
    let input = document.querySelector('textarea[name=specialization]');
    let input2 = document.querySelector('textarea[name=Qualification]');

    this.medicalInfo.specializations = new Tagify(input).value;
    this.medicalInfo.qualifications = new Tagify(input2).value;

    $(document).ready(function() {
      $.uploadPreview({
        input_field: "#image-upload",   // Default: .image-upload
        preview_box: "#image-preview",  // Default: .image-preview
        label_field: "#image-label",    // Default: .image-label
        label_default: "Choose Image",   // Default: Choose File
        label_selected: "Change Image",  // Default: Change File
        no_label: false                 // Default: false
      });
    });
  }

  checkPhone(){
    if(this.contactInfo.isPhone){
      this.contactInfo.whatsapp_number = this.contactInfo.phone;
    }
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.crop = true;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  async cropped() {
    this.crop = false;
    this.img;
    if(this.photo.nativeElement.files.length != 0){
      this.img = await this.urltoFile(this.croppedImage, this.photo.nativeElement.files[0].name,this.photo.nativeElement.files[0].type);
      this.photoPreview = this.sanitize.bypassSecurityTrustStyle("url('" + this.croppedImage + "') center no-repeat");
    }
  }
  
  cancelCrop(){
    this.crop = false;
  }

  urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
  }

  checkUniqueness(phone: NgModel){
    if(phone.valid){
      this.phoneUniqueErrors = true;
      this.authService.uniquePhone({phone: phone.model}).subscribe((res: any) => {
        Notiflix.Notify.Success(res.message);
        this.phoneUniqueErrors = false;
      }, err => {
        Notiflix.Notify.Failure(err.error.message);
        this.contactInfo.phone = '';
        this.phoneUniqueErrors = false;

      })
    }else{
      this.phoneUniqueErrors = false;
    }
  }
  addBasic(f: NgForm){
    this.submit = true;
    this.loadingInfo = true;

    this.stateSrevice.updateApprovalMessage({
      disabled: false
    });
    let doctorData = new FormData();

    doctorData.append("name", this.basicInfo.name);
    doctorData.append("dob", this.basicInfo.dob);
    doctorData.append("gender", this.basicInfo.gender);
    doctorData.append("designation", this.basicInfo.designation);
    doctorData.append("department", this.basicInfo.department);
    doctorData.append("blood_group", this.basicInfo.blood_group);
    doctorData.append("online_fees", this.basicInfo.online_fees);
    doctorData.append("offline_fees", this.basicInfo.offline_fees);

    if(this.photo.nativeElement.files.length != 0){
      doctorData.append('photo', this.img) 
    }

    this.doctorService.addBasicInfo(doctorData).pipe(
      map((event: any) => {
        switch(event.type){
          case HttpEventType.UploadProgress:
            let progress = Math.round(event.loaded * 100 / event.total);
            this.progress.width = progress+'%';
            this.progress.complete = true;
            break;
          case HttpEventType.Response:
            Notiflix.Notify.Success("Doctor Added !");
            localStorage.setItem("docId", event.body.doctor.id);
            this.submit = true;
            this.disableContact = false;
            this.disableMedical = false;
            this.loadingInfo = false;
            return event;
        }
      }),
      catchError((err => {
        Notiflix.Notify.Failure(err.error.message);
        this.saving = false;
        this.submit = false;
        this.loadingInfo = false;
        return 'Upload Failed!!!';
      }))
    ).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
         console.log("Done")
        }  
      }
    );
    
  }
  addMedicalInfo(f: NgForm){
    this.loadingMedical = true;
    this.disableMedical = true;
    if(localStorage.getItem('docId') == undefined){
      Notiflix.Notify.Failure("Doctor not registed in the system.");
    }

    let specialization = [];
    this.medicalInfo.specializations.map(item => specialization.push(item.value));
    let qualification = [];
    this.medicalInfo.qualifications.map(item => qualification.push(item.value));

    let doctorJSON = {
      specializations: specialization,
      qualifications: qualification,
      experience: this.medicalInfo.experience
    };

    this.doctorService.updateDoc(localStorage.getItem('docId'), doctorJSON).subscribe((res: any) => {  
        Notiflix.Notify.Success("Doctor Added !");
        this.loadingMedical = false;
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.saving = false;
        this.loadingMedical =false;
        this.disableMedical = false;
      }
    );
  }

  addContactInfo(f: NgForm){
    this.loadingContact = true;
    this.disableContact = true;
  
    let doctorJSON = {
      phone: this.contactInfo.phone,
      whatsapp_number: this.contactInfo.whatsapp_number,
      email: this.contactInfo.email,
      address: {
        address_line_1: this.contactInfo.add1,
        address_line_2: this.contactInfo.add2,
        city: this.contactInfo.city,
        country: this.contactInfo.country
      }
    }

    this.doctorService.updateDoc(localStorage.getItem('docId'), doctorJSON).subscribe((res: any) => {  
        Notiflix.Notify.Success("Doctor Updated !");
        this.loadingContact = false;
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.saving = false;
        this.disableContact = false;
        this.loadingContact = false;
        if(err.status == 500){
          Notiflix.Notify.Failure("Possible Incorrect or duplicate information.");
        }else{
          Notiflix.Notify.Failure(err.error.message);
        }
        return 'Upload Failed!!!';
      }
    );
  }
}
