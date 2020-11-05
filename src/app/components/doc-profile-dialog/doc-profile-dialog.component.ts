import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Staff } from 'src/app/models/staff';
declare var $:any;
declare var Notiflix:any;
@Component({
  selector: 'app-doc-profile-dialog',
  templateUrl: './doc-profile-dialog.component.html',
  styleUrls: ['./doc-profile-dialog.component.scss']
})
export class DocProfileDialogComponent implements OnInit {

  staff: Staff = new Staff();
  loading: boolean;
  update = false;
  @ViewChild('photo') photo: ElementRef<HTMLInputElement>;
  phoneUniqueErrors: boolean;
  disabled: boolean;


  constructor(private staffService: StaffService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
     public dialogRef: MatDialogRef<DocProfileDialogComponent>) { }

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

    if(this.data.staff){
      this.update = true;
      this.staffService.getStaff(this.data.staff.id).subscribe((res: any) => {
        this.staff = res.staff;
        this.staff.role = res.staff.roles[0].role
      });
    }
  }

  fileChangeEvent(data){
    
  }
  checkUniqueness(phone: NgModel){
    if(phone.valid){
      this.phoneUniqueErrors = true;
      this.authService.uniquePhone({phone: phone.model}).pipe(take(1)).subscribe((res: any) => {
        Notiflix.Notify.Success(res.message);
        this.phoneUniqueErrors = false;
      }, err => {
        Notiflix.Notify.Failure(err.error.message);
        this.staff.phone = '';
        this.phoneUniqueErrors = false;
      })
    }else{
      this.phoneUniqueErrors = false;
    }
  }


  disableStaff(){
    this.disabled = true;
    let updateData:any = {};

    updateData.disabled = true;
    this.staffService.updateStaff(this.data.staff.id, updateData).pipe(take(1)).subscribe((res: any) => {
      Notiflix.Notify.Success(res.message);
      this.disabled = false;
      this.dialogRef.close(1);
    }, err => {
      Notiflix.Notify.Failure(err.error.message);
      this.disabled = false;
    })
    
  }
  close_pat(){
    this.dialogRef.close(0);
  }

  addStaff(f:NgForm){
    this.loading = true;
    let staffData = new FormData();
    staffData.append('username', this.staff.username);
    staffData.append('name', this.staff.name);
    staffData.append('role', this.staff.role);
    staffData.append('password', this.staff.password);

    if(this.staff.phone) {
      staffData.append('phone', this.staff.phone || '');
    }
    if(this.staff.email) {
      staffData.append('email', this.staff.email || '');
    }
    // if((this.data.staff != undefined) && (!this.data.staff.id) && (this.photo.nativeElement.files.length != 0)){
    //   staffData.append('photo', this.photo.nativeElement.files[0]);
    // }

    if((this.data.staff != undefined) && (this.data.staff.id)){
      let updateStaff = {
        username: this.staff.username,
        name: this.staff.name,
        role: this.staff.role,
        password: this.staff.password,
        phone: this.staff.phone,
        email: this.staff.email
      }
      this.staffService.updateStaff(this.data.staff.id, updateStaff).pipe(take(1)).subscribe((res: any) => {
        Notiflix.Notify.Success(res.message);
        this.loading = false;
        this.dialogRef.close(1);
      },err => {
        Notiflix.Notify.Failure(err.error.message);
        this.loading = false;
      });
    }else{
      this.staffService.createUser(staffData).pipe(take(1)).subscribe((res: any) => {
        this.loading = false;
        this.dialogRef.close(1);
        Notiflix.Notify.Success("New Staff Added !");
      },err => {
        // console.log(err);
        this.loading = false;
        if(err.status == 500){
          Notiflix.Notify.Failure("Possible incorrect or duplicate Information.");
        }else{
          Notiflix.Notify.Failure(err.error.message);
        }
      });
    }
  }

  
}
