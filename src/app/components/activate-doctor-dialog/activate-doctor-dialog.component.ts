import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var Notiflix:any;

@Component({
  selector: 'app-activate-doctor-dialog',
  templateUrl: './activate-doctor-dialog.component.html',
  styleUrls: ['./activate-doctor-dialog.component.scss']
})
export class ActivateDoctorDialogComponent implements OnInit {

  loading = false;
  confirmDelete = {
    password:''
  }
  constructor(private doctorService: DoctorService,
    public dialogRef: MatDialogRef<ActivateDoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

  activateDoc(){
    let status; 
    if(this.data.type == 'disable'){
      status = {
        status: false,
        password: this.confirmDelete.password
      }
    }else if(this.data.type == 'enable'){
      status = {
        status: true,
        password: this.confirmDelete.password
      }
    }
    
    this.loading = true;

    this.doctorService.updateDocStatus(this.data.doc, status).subscribe((res: any) => {
        Notiflix.Notify.Success(res.body.message);
        this.loading = false;
        this.dialogRef.close({success:1});
    }, err => {
      Notiflix.Notify.Failure(err.error.message);
      this.loading = false;
      this.confirmDelete.password = '';
    })
  }
}
