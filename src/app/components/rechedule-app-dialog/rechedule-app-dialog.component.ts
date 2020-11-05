import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/NotificationService';
import { InstantNotificationDialogComponent } from '../instant-notification-dialog/instant-notification-dialog.component';
declare var Notiflix: any;

@Component({
  selector: 'app-rechedule-app-dialog',
  templateUrl: './rechedule-app-dialog.component.html',
  styleUrls: ['./rechedule-app-dialog.component.scss']
})
export class RecheduleAppDialogComponent implements OnInit {
  status = false;
  loading = false;

  rescheduleAppointment = {
    original_time: '',
    orginal_date: '',
    new_time: '',
    slot_id: 0,
    password: ''
  }

  constructor(
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<InstantNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.rescheduleAppointment.orginal_date = this.data.reschedule.bookingDate;
    this.rescheduleAppointment.original_time = this.data.reschedule.slot.start_time + ' - ' + this.data.reschedule.slot.end_time;
  }

  reschedule(form: NgForm) {
    this.loading = true;
    let generalFormData = new FormData();

  }

}
