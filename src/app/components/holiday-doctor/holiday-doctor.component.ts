import { StateService } from 'src/app/services/state.service';
import { CofirmCreateHolidayDialogComponent } from './../cofirm-create-holiday-dialog/cofirm-create-holiday-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { SlotService } from 'src/app/services/slot.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { HolidayService } from 'src/app/services/holiday.service';
import { NgForm, FormControl } from '@angular/forms';
import { Holiday } from 'src/app/models/holidays.model';
import * as jwt_decode from 'jwt-decode';
import { CancelHolidayDialogComponent } from '../cancel-holiday-dialog/cancel-holiday-dialog.component';

declare var Notiflix:any;
declare var $:any;

@Component({
  selector: 'app-holiday-doctor',
  templateUrl: './holiday-doctor.component.html',
  styleUrls: ['./holiday-doctor.component.scss']
})
export class HolidayDoctorComponent implements OnInit, AfterViewInit {

  allholidays = [];
  loading;
  loadHoliday: boolean;
  slotControl = new FormControl();
  holidays: Holiday = new Holiday();
  @Input() doctorId;
  @Input() days;
  @Input() active;

  disable = false;
  slots: any = [];
  role: any;
  docDeleted: any = false;
  
  constructor(private holidayService: HolidayService, 
    private cookie: CookieService,
    private stateService: StateService,
    private dialog: MatDialog,
    private slotService: SlotService) { }
    
  ngAfterViewInit(): void {
    this.stateService.currentApprovalrefreshStateMessage.subscribe((res: any) => {
      if(JSON.parse(res).state == true){
        this.getSlots();
      }
    });
    
  }

  ngOnInit(): void {
    this.getHolidays();
    this.loading = true;

    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];
    this.getSlots();
    this.stateService.currentApprovalDelDocMessage.subscribe((res: any) => {
      this.docDeleted = !JSON.parse(res);
    })
  }

  getSlots(){
    this.slotService.getALlSlots(this.doctorId).subscribe(
      (res: any) => {
        this.slots = res.slots;
        this.loading = false;
      },
      err => {
        this.loading = false;
        if(err.error.message == 'No Slots'){
          this.slots = [];
        }
      }
    )
  }
  getHolidays(){
    this.holidayService.getHolidays(this.doctorId).subscribe(
      (res: any) => {
        this.allholidays = res.holidays;
        this.loadHoliday = false;
      },
      err => {
        // console.log(err);
        if(err.error.message == 'Holiday Not Found'){
          this.allholidays = [];
        }
        this.loadHoliday = false;
      }
    );
  }

  SelectTime(event, i){
    this.days.forEach(day => day.disabled = true);
    this.days[i].disabled = false;
  }
  
  createHolidays(f: NgForm){
    this.loading = true;
    this.disable = true;
    let slots = JSON.stringify(this.holidays.slots);

    let holiday = {
      doctor: this.doctorId,
      start_date: this.holidays.start_date,
      end_date: this.holidays.end_date,
      slots: slots
    }
    
    this.holidayService.createHolidays(holiday).subscribe(
      (res: any) => {
        if(res.status == 200){
          Notiflix.Notify.Success("Holidays Assigned !");
          this.getHolidays();
          this.holidays.slots = [];
          f.reset();
          this.loading = false;
          this.disable = false;
        }else if(res.status == 206){
          this.loading = false;
          this.dialog.open(CofirmCreateHolidayDialogComponent, {
            width: '400px',
            id: 'holidayConfirm',
            disableClose: true,
            data: {origin: 'Holiday', message: res.body.message, payload:holiday}
          });
          this.dialog.getDialogById('holidayConfirm').afterClosed().subscribe((res: any) => {
            if(res.success == 1){
              this.ngOnInit();
              f.reset();
            }
            this.disable = false;
          });
        }
      },
      err => {
        // console.log(err);
        // Notiflix.Notify.Failure(err.error.message);
        this.disable = false;
        this.loading = false;
      }
    );
  }

  deleteHoliday(holiday){
    this.dialog.open(CancelHolidayDialogComponent, {
      width: '400px',
      id: 'cancelHoliday',
      disableClose: true,
      data: { origin: 'Holiday', holiday: holiday }
    });
    this.dialog.getDialogById('cancelHoliday').afterClosed().subscribe((res: any) => {
      if(res.success == 1){
        this.ngOnInit();
      }
    })
  }
}
