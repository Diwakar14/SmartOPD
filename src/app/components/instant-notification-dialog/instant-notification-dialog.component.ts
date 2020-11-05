import { NotificationService } from './../../services/NotificationService';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var Notiflix: any;
@Component({
  selector: 'app-instant-notification-dialog',
  templateUrl: './instant-notification-dialog.component.html',
  styleUrls: ['./instant-notification-dialog.component.scss']
})
export class InstantNotificationDialogComponent implements OnInit {
  status = false;
  loading = false;

  notification = {
    title: '',
    message: ''
  }

  constructor(
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<InstantNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    //console.log(this.data);
  }

  notifyAll(form: NgForm) {
    console.log(this.notification);
    this.loading = true;
    let generalFormData = new FormData();
    generalFormData.append("title", this.notification.title);
    generalFormData.append("body", this.notification.message);
    generalFormData.append("recipient", 'Patient');
    generalFormData.append("patients", JSON.stringify(this.data.appointments.map(i => i.patient_id)));
    this.notificationService.createNotification(generalFormData).subscribe(
      res => {
        Notiflix.Notify.Success("Notification Sent to All.");
        this.loading = false;
        this.dialogRef.close();
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.loading = false;
      }
    )
  }


}
