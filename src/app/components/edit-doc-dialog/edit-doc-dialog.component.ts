import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Sanitizer } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { NgForm, NgModel } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

declare var Notiflix:any;
declare var $: any;
declare var Tagify: any;


@Component({
  selector: 'app-edit-doc-dialog',
  templateUrl: './edit-doc-dialog.component.html',
  styleUrls: ['./edit-doc-dialog.component.scss']
})
export class EditDocDialogComponent implements OnInit, AfterViewInit {
  editbasic = false;
  editmedical = false;
  editcontact = false;


  loadingInfo = false;
  loadingMedical = false;
  loadingContact = false;

  submit = false;

  departments;
  photoPreview: any;

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
    specializations: '',
    qualifications: '',
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
  
  complete: boolean = false;
  width: number = 0;

  @ViewChild('photo') photo: ElementRef<HTMLInputElement>;
  imageChangedEvent: any;
  croppedImage: string;
  crop: boolean = false;
  
  input: any;
  input2: any;
  phoneUniqueErrors: boolean;

  constructor(public dialogRef: MatDialogRef<EditDocDialogComponent>,
    private docService: DoctorService,
    private deptService: DepartmentService,
    private authService: AuthService,
    private sanitize: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    }
  
  ngAfterViewInit(): void {
    this.input = new Tagify(document.querySelector("#quali"));
    this.input2 = new Tagify(document.querySelector("#speci"));

  }
  

  ngOnInit(): void {
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

    switch(this.data.origin){
      case 'editBasic':
        this.editbasic = true;
        this.deptService.getDepartment(true).subscribe((res: any) => this.departments = res.departments);
        this.basicInfo.name = this.data.doctorBasic.name;
        this.basicInfo.gender = this.data.doctorBasic.gender;
        this.photoPreview = this.sanitize.bypassSecurityTrustStyle("url('" + (this.data.doctorBasic.photo || '../../../assets/icons/favIcon.png') + "') center no-repeat");
        this.basicInfo.dob = this.data.doctorBasic.dob;
        this.basicInfo.designation = this.data.doctorBasic.doctor_detail.designation;
        this.basicInfo.department = this.data.doctorBasic.doctor_detail.department.name;
        this.basicInfo.offline_fees = this.data.doctorBasic.doctor_detail.offline_fees;
        this.basicInfo.online_fees = this.data.doctorBasic.doctor_detail.online_fees;
        break;
      case 'editMedical':
        this.editmedical = true;
        setTimeout(() => {
          this.input.addTags(this.data.doctorMedical.doctor_detail.qualifications);
          this.input2.addTags(this.data.doctorMedical.doctor_detail.specializations);
          this.medicalInfo.experience = this.data.doctorMedical.doctor_detail.experience;
        }, 1000);
        break;
      case 'editContact':
        this.editcontact = true;
        this.contactInfo.phone = this.data.doctorContact.phone;
        this.contactInfo.email = this.data.doctorContact.email;
        this.contactInfo.add1 = this.data.doctorContact.address !=null? this.data.doctorContact.address.address_line_1 : '';
        this.contactInfo.add2 = this.data.doctorContact.address !=null? this.data.doctorContact.address.address_line_2 : '';
        this.contactInfo.country = this.data.doctorContact.address !=null? this.data.doctorContact.address.country : '';
        this.contactInfo.city = this.data.doctorContact.address !=null? this.data.doctorContact.address.city : '';
        this.contactInfo.whatsapp_number = this.data.doctorContact.whatsapp_number;
        break;
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
    let img;

    let docPhoto = new FormData();
    if(this.photo.nativeElement.files.length != 0){
      img = await this.urltoFile(this.croppedImage, this.photo.nativeElement.files[0].name,this.photo.nativeElement.files[0].type);
      docPhoto.append('photo', img);
      this.photoPreview = this.sanitize.bypassSecurityTrustStyle("url('" + this.croppedImage + "') center no-repeat");
      this.docService.uploadDocPhoto(this.data.docId, docPhoto).pipe(
        map(event => {
          switch(event.type){
            case HttpEventType.UploadProgress:
              let progress = Math.round(event.loaded * 100 / event.total);
              this.width = progress;
              this.complete = true;
              break;
            case HttpEventType.Response:
              this.complete = false;
              Notiflix.Notify.Success("Doctor photo Uploaded.");
              return event;
          }
        }),
        catchError((err => {
          Notiflix.Notify.Failure(err.error.message);
          this.complete = false;
          return 'Upload Failed!!!';
        }))
      ).subscribe((res: any) => {
      });
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

  checkPhone(){
    if(this.contactInfo.isPhone){
      this.contactInfo.whatsapp_number = this.contactInfo.phone;
    }
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
  show(event){
    console.log(event);
  }

  addBasic(f: NgForm){
    this.loadingInfo = true;

    let doctorJSON = {
      name: this.basicInfo.name,
      dob: this.basicInfo.dob,
      gender: this.basicInfo.gender,
      designation: this.basicInfo.designation,
      department: JSON.stringify(this.basicInfo.department),
      blood_group: this.basicInfo.blood_group,
      online_fees: this.basicInfo.online_fees,
      offline_fees: this.basicInfo.offline_fees,
    }
  
    this.docService.updateDoc(this.data.docId, doctorJSON).subscribe((res: any) => {  
        Notiflix.Notify.Success("Doctor Updated !");
        this.loadingInfo = false;
        if(this.dialogRef.id == 'editBasic'){
          this.dialogRef.close(false);
        }
      },
      err => {
        Notiflix.Notify.Failure("Doctor Update Failed !");
        this.loadingInfo = false;
      }
    );
    
  }

  addMedicalInfo(f: NgForm){
    this.loadingMedical = true;
    
    let specializations = this.input2.value.map(i => i.value);
    let qualifications = this.input.value.map(i => i.value);

    let doctorJSON = {
      specializations: specializations, 
      qualifications: qualifications,
      experience: this.medicalInfo.experience
    };
    
    this.docService.updateDoc(this.data.docId, doctorJSON).subscribe((res: any) => {  
        Notiflix.Notify.Success("Doctor Updated !");
        this.loadingMedical = false;
        if(this.dialogRef.id == 'editMedical'){
          this.dialogRef.close(false);
        }
      },
      err => {
        Notiflix.Notify.Failure("Doctor Update Failed !");
        this.loadingMedical = false;
      }
    );
  }

  addContactInfo(f: NgForm){
    this.loadingContact = true;
    let doctorJSON = {
      phone: this.contactInfo.phone,
      whatsapp_number: this.contactInfo.whatsapp_number,
      address: {
        address_line_1: this.contactInfo.add1,
        address_line_2: this.contactInfo.add2,
        city: this.contactInfo.city,
        country: this.contactInfo.country
      },
      email: this.contactInfo.email
    }

    this.docService.updateDoc(this.data.docId, doctorJSON).subscribe((res: any) => {  
        Notiflix.Notify.Success("Doctor Updated !");
        this.loadingContact = false;
        if(this.dialogRef.id == 'editContact'){
          this.dialogRef.close(false);
        }
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.loadingContact = false;
      }
    );
  }


}
