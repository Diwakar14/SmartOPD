import { HolidayService } from 'src/app/services/holiday.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare var Notiflix:any;
@Component({
  selector: 'app-cofirm-create-holiday-dialog',
  templateUrl: './cofirm-create-holiday-dialog.component.html',
  styleUrls: ['./cofirm-create-holiday-dialog.component.scss']
})
export class CofirmCreateHolidayDialogComponent implements OnInit {
  status = true;
  loading = false;

  confirmCreate = {
    password:''
  }
  holiday: any = {};
  message: any;
  constructor(public dialogRef: MatDialogRef<CofirmCreateHolidayDialogComponent>,
    private holidayService: HolidayService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.message = this.data.message;
  }

  confirmCreateHoliday(f:NgForm){
    this.loading = true;
    this.holiday = this.data.payload;
    this.holiday.password = this.confirmCreate.password;

    // console.log(this.holiday);

    this.holidayService.createHolidays(this.holiday).subscribe(
      (res: any) => {
        if(res.status == 200){
          Notiflix.Notify.Success("Holidays Assigned !");
          this.dialogRef.close({success:1});
        }
      },
      err => {
        console.log(err);
        Notiflix.Notify.Failure(err.error.message);
        this.loading = false;
        if(err.status != 406){
          this.dialogRef.close({success: 0});
        }
      }
    );
  }

}
