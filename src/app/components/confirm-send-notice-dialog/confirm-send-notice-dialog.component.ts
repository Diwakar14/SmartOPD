import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-send-notice-dialog',
  templateUrl: './confirm-send-notice-dialog.component.html',
  styleUrls: ['./confirm-send-notice-dialog.component.scss']
})
export class ConfirmSendNoticeDialogComponent implements OnInit {

  title;
  message;
  origin: any;
  constructor(public dialogRef: MatDialogRef<ConfirmSendNoticeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.origin = this.data.origin;
  }

  confirm(){
    switch(this.origin){
      case 'gen':
        this.dialogRef.close({confirm:true});
        break;
      case 'doc':
        this.dialogRef.close({confirm:true});
        break;
      case 'pat':
        this.dialogRef.close({confirm:true});
        break;
      case 'dept':
        this.dialogRef.close({confirm:true});
        break;
    }
  }

}
