import { SlotService } from 'src/app/services/slot.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var Notiflix: any;



@Component({
  selector: 'app-edit-slot-dialog',
  templateUrl: './edit-slot-dialog.component.html',
  styleUrls: ['./edit-slot-dialog.component.scss']
})
export class EditSlotDialogComponent implements OnInit {


  loading = false;
  patient = {
    no_patients:''
  }
  constructor(private slotService: SlotService,
    public dialogRef: MatDialogRef<EditSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.patient.no_patients = this.data.slot.max_patient_count;
  }


  updateSlot(f: NgForm){
    this.loading = true;
    let patientJSON = {
      patient_count: this.patient.no_patients
    }
    this.slotService.editSlot(this.data.slot.id, patientJSON).subscribe((res: any) => {
      this.loading = false;
      this.dialogRef.close(false);
      Notiflix.Notify.Success(res.body.message);
    },
    err => {
      this.loading = false;
      Notiflix.Notify.Failure(err.error.message);
    });
  }
}
