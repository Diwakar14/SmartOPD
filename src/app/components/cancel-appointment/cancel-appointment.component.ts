import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-appointment',
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.scss']
})
export class CancelAppointmentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CancelAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }


  confirmCancel = {
    password:'',
    reason:''
  }

  ngOnInit(): void {
  }

  confirm(){
    this.dialogRef.close({confirm: true, data: this.confirmCancel});
  }

}
