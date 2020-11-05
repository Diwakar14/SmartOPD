import { NgForm } from '@angular/forms';
import { SlotService } from 'src/app/services/slot.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var Notiflix: any;
@Component({
  selector: 'app-delete-slot-dialog',
  templateUrl: './delete-slot-dialog.component.html',
  styleUrls: ['./delete-slot-dialog.component.scss']
})
export class DeleteSlotDialogComponent implements OnInit {

  status = false;
  loading = false;

  confirmDelete = {
    password:''
  }

  slot;
  message: any;
  constructor(private slotService: SlotService,
    public dialogRef: MatDialogRef<DeleteSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.slot = this.data.slot;
  }

  confirm(data){
    if(data == 200){
      this.loading = true;
      this.slotService.deleteSlot(this.data.slot.id).subscribe((res: any) => {
        if(res.status==206){
          this.status = true;
          this.message = res.body.message;
        }else if(res.status == 200){
          Notiflix.Notify.Success(res.body.message);
          this.dialogRef.close(false);
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        Notiflix.Notify.Failure(err.error.message);
      });
    }else if(data == 206){
      this.loading = true;
      this.slotService.deleteSlot(this.slot.id, this.confirmDelete.password).subscribe((res: any) => {
        this.loading = false;
        if(res.status == 200){
          Notiflix.Notify.Success(res.body.message);
          this.dialogRef.close(false);
        }
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.loading = false;
      });
    }
  }

  confirmDel(f: NgForm){

  }

}
