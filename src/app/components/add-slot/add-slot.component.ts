import { DoctorService } from 'src/app/services/doctor.service';
import { EditSlotDialogComponent } from 'src/app/components/edit-slot-dialog/edit-slot-dialog.component';
import { DeleteSlotDialogComponent } from 'src/app/components/delete-slot-dialog/delete-slot-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StateService } from 'src/app/services/state.service';
import { SlotService } from 'src/app/services/slot.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Slot } from './../../models/slot.model';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import { take } from 'rxjs/operators';

declare var Notiflix:any;
declare var $: any;

@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.component.html',
  styleUrls: ['./add-slot.component.scss']
})
export class AddSlotComponent implements OnInit {
  slot = new Slot();
  days = [];

  loading = false;
  submit: boolean;
  dayError = false;

  disable = false;
  allslots = [];
  docDeleted = false;

  slotForm:FormGroup = new FormGroup({
    start_time: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{2}:[0-9]{2}')
    ]),
    end_time: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{2}:[0-9]{2}')
    ]),
    consultation_type: new FormControl('', Validators.required),
    no_of_pat: new FormControl('', Validators.required)
  });
  role: any;
  disabledDoc = true;

  get start_time(){
    return this.slotForm.get('start_time');
  }
  get end_time(){
    return this.slotForm.get('end_time');
  }
  get consultation_type(){
    return this.slotForm.get('consultation_type');
  }
  get no_of_pat(){
    return this.slotForm.get('no_of_pat');
  }

  @Input() doctorId;
  @Input() origin;
  @Input() active;

  constructor(private slotService: SlotService,
    private stateService: StateService,
    private cookie: CookieService,
    private dialog: MatDialog,
    ) 
    { 
      
    }
 
  
  ngOnInit(): void {
    
    this.stateService.currentApprovalStageMessage.subscribe((res: any) => {
      this.disable = JSON.parse(res).disabled;
    });

    this.stateService.currentApprovalDelDocMessage.subscribe((res: any) => {
      this.docDeleted = !JSON.parse(res);
    });
    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];

    if(this.doctorId == undefined)
      this.doctorId = 99999;
    if(this.origin == 'docProfile'){
      this.loading = true;
      this.slotService.getALlSlots(this.doctorId).subscribe(
        (res:any) => {
          this.allslots = res.slots;
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      )
    }else{
      this.disable = true;
    }
  }

  addDays(day){
    let gotit = this.days.findIndex(item => item.name == day.name);
    if(gotit < 0)
      this.days.push(day);
    else if(gotit >= 0){
      this.days.splice(gotit, 1);
    }    
  }


  editSlot(slot){
    this.dialog.open(EditSlotDialogComponent, {
      width: '300px',
      id: 'editSlot',
      data: {orgin: 'slot', slot: slot},
      disableClose: true
    });
    this.dialog.getDialogById('editSlot').afterClosed().subscribe((res:any) => {
      if(JSON.parse(res) != true){
        this.refereshSlots();
        this.stateService.updateApprovalRefreshMessage({
          state: true
        });
      }
        // this.ngOnInit();
    });
  }

  
  deleteSlot(slot){
    this.dialog.open(DeleteSlotDialogComponent, {
      width: '400px',
      id: 'deleteSlot',
      data: {orgin: 'slot', slot: slot},
      disableClose: true
    });
    this.dialog.getDialogById('deleteSlot').afterClosed().subscribe((res:any) => {
      if(JSON.parse(res) != true){
        this.refereshSlots();
        this.stateService.updateApprovalRefreshMessage({
          state: true
        });
      }
        // this.ngOnInit();
    });
  }

  addSlot(){
    let cons_days = [];
    let slot_data = new FormData();

    this.submit = true;
    this.loading = true

    if(this.days.length < 0) {
      Notiflix.Notify.Success("Select a day.");
      return false;
    }

    if(this.doctorId == undefined){
      Notiflix.Notify.Success("Add Doctor First.");
      return
    }

    if(this.origin == 'addDoc'){
      this.doctorId = localStorage.getItem('docId');
    }
    
    this.days.map(item => cons_days.push(item.name));
    slot_data.append("doctor", this.doctorId);
    slot_data.append("consultation_type", this.slot.consultation_type);
    slot_data.append("start_time", this.slot.start_time);
    slot_data.append("end_time", this.slot.end_time);
    slot_data.append("max_patient_count", this.slot.max_patient_count);
    slot_data.append("days", JSON.stringify(cons_days));


    let datas_data = document.querySelectorAll('.days input[type=checkbox]');


    this.slotService.createSlots(slot_data).subscribe(
      (res: any) => {
        Notiflix.Notify.Success("Slot Added !");
        this.loading = true;
        this.submit = false;
        this.days = [];
        cons_days = [];
        datas_data.forEach((item:any) => item.checked = false);

        this.slotService.getALlSlots(this.doctorId).subscribe(
          (res:any) => {
            this.allslots = res.slots;
            this.loading = false;
          },
          err => {
            // console.log(err);
            this.loading = false;
          }
        )
        this.slotForm.reset(this.slot);
        this.stateService.updateApprovalRefreshMessage({
          state: true
        });
      },
      err => {
        Notiflix.Notify.Failure("Slot Creation failed !");
        this.submit = false;
        this.loading = false;
        this.days = [];
        cons_days = [];
        datas_data.forEach((item:any) => item.checked = false);
      }
    );
  }


  refereshSlots(){
    this.loading = true;
    this.slotService.getALlSlots(this.doctorId).subscribe(
      (res:any) => {
        this.allslots = res.slots;
        this.loading = false;
        // console.log(this.allslots);
      },
      err => {
        // console.log(err);
        if(err.error.message == 'No Slots')
          this.allslots = [];
        this.loading = false;
      }
    )
  }
}
