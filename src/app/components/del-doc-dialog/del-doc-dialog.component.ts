import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { DoctorService } from 'src/app/services/doctor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var Notiflix:any;
@Component({
  selector: 'app-del-doc-dialog',
  templateUrl: './del-doc-dialog.component.html',
  styleUrls: ['./del-doc-dialog.component.scss']
})
export class DelDocDialogComponent implements OnInit {

  confirmDelete = {
    password:''
  }
  confirmPass = false;
  loading = false;
  constructor(private docService: DoctorService,
    public dialogRef: MatDialogRef<DelDocDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
    ) { }

  ngOnInit(): void {

  }
  confirm(){
    this.loading = true;
    this.docService.deleteDoctor(this.data.doc, this.confirmDelete.password).subscribe((res: any) => {
      this.loading = false;
      Notiflix.Notify.Success(res.body.message);
      this.dialogRef.close();
      this.router.navigateByUrl('/dashboard/doctors');
    }, err => {
      this.loading = false;
      if(err.status == 406){
        Notiflix.Notify.Failure(err.error.message);
      }else{
        Notiflix.Notify.Failure("Doctor remove failed !");
        this.dialogRef.close();
      }
    });
  }

  delDoc(f: NgForm){
    this.confirm();
  }
}
