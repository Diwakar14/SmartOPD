import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HolidayService } from 'src/app/services/holiday.service';
declare var Notiflix:any;

@Component({
  selector: 'app-cancel-holiday-dialog',
  templateUrl: './cancel-holiday-dialog.component.html',
  styleUrls: ['./cancel-holiday-dialog.component.scss']
})
export class CancelHolidayDialogComponent implements OnInit {

  start;
  loading = false;
  end;
  constructor(public dialogRef: MatDialogRef<CancelHolidayDialogComponent>,
    private holidayService: HolidayService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.start = this.data.holiday.start_date;
    this.end = this.data.holiday.end_date;
  }

  confirm(){
    this.loading = true;
    this.holidayService.deleteHolidays(this.data.holiday.id).subscribe((res: any) => {
      if(res.status == 200){
        Notiflix.Notify.Success("Holidays Cancelled !");
        this.dialogRef.close({success: 1});
      }
    },
    err => {
      Notiflix.Notify.Success("Holidays Cancel Failed !");
    })
  }

}
