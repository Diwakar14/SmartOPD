import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-appointment-dialog',
  templateUrl: './confirm-appointment-dialog.component.html',
  styleUrls: ['./confirm-appointment-dialog.component.scss']
})
export class ConfirmAppointmentDialogComponent implements OnInit {

  loading = false;
  message;
  constructor(public dialogRef: MatDialogRef<ConfirmAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.message = this.data.message;
  }

  confirmBook(form){
    this.dialogRef.close({confirm: true});
  }

}
