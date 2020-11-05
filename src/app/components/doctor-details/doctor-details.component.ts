import { CreateApptmntDialogComponent } from 'src/app/components/create-apptmnt-dialog/create-apptmnt-dialog.component';
import { Appointment } from './../../models/appointment.model';
import { StateService } from 'src/app/services/state.service';
import { NgForm, FormControl } from '@angular/forms';
import { Holiday } from './../../models/holidays.model';
import { SlotService } from './../../services/slot.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { CreateSlotDialogComponent } from '../create-slot-dialog/create-slot-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HolidayService } from 'src/app/services/holiday.service';
import { AppointmentService } from 'src/app/services/appointment.service';
declare var Notiflix:any;
interface Slot {
  id: any;
  start_time: string;
  end_time: string;
  max_patient_count: number;
  consultation_type: string;
}

class Days {
  disabled?: boolean;
  name: string;
  onlineSlot: Slot[];
  offlineSlot: Slot[];
}
@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {

  doctor;
  doctorId;
  allholidays = [];
  loading = true;
  loadHoliday = true;
  loadingSlot;
  
  days: Days[] = [];
  slotControl = new FormControl();
  doctorSlots: any;
  appointment: Appointment;
  slotOnly: [];


  constructor(private activatedRoute: ActivatedRoute, 
    private dialog: MatDialog,
    private slotService: SlotService,
    private stateService: StateService,
   
    private appointmentService: AppointmentService,
    private doctorService: DoctorService) {
      this.stateService.updateApprovalMessage({
        "toolbarTitle": "Doctor Profile",
        "sidebar": false,
      });
     }

  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.paramMap.get('id');
    this.doctorService.getDoctor(this.doctorId).subscribe(
      (res:any) => {
        this.doctor = res.doctor;
        console.log(this.doctor);
        this.loading = false;
      },
      err => {
        console.log(err);
        
      }
    )
    this.getSlots();
   
  }


  getAppointment(){

  }

  

  getSlots(){
    this.days = [];
    this.loadingSlot = true;
    this.slotService.getALlSlots(parseInt(this.doctorId)).subscribe(
      (res: any) => {
        for (let i = 0; i < res.slots.length; i++) {
          let days: Days = new Days();
          days.name = res.slots[i].day;
          days.onlineSlot = res.slots[i].online_slots==undefined? [] : res.slots[i].online_slots;
          days.offlineSlot = res.slots[i].offline_slots==undefined?[]:res.slots[i].offline_slots;
          this.days.push(days);
        }
        this.loadingSlot = false;
        console.log(this.days);
      },
      err => {
        console.log(err);
        this.loadingSlot = false;
      }
    )
  }

  SelectTime(event, i){
    this.days.forEach(day => day.disabled = true);
    this.days[i].disabled = false;
  }
  

  openCreateAppointmentDialog(){
    let createApp = {
      doctorId: this.doctor.id,
    }
    const dialogRef = this.dialog.open(CreateApptmntDialogComponent, {
      width: '30%',
      data: {doctor: this.doctor}
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result){
        let appointment = {
          doctor: this.doctor.id,
          patient: 1,
          slot: result.slotId,
        }
        this.appointmentService.createAppointment(appointment).subscribe(
          res => {
            Notiflix.Notify.Success("Appointment Created !");
            this.getAppointment();
          },
          err => {
            Notiflix.Notify.Failure("Error in creating appointment !");
          }
        );
      }
    });
  }

  openCreateSlotDialog(){
    const dialogRef = this.dialog.open(CreateSlotDialogComponent, {
      width: '30%',
      data: {doctor: 'doctor'}
    });

    dialogRef.afterClosed().subscribe(result => { 
      if(result!=null){
        let slot = {
          doctor: this.doctorId,
          days: JSON.stringify(result.days),
          start_time: result.start_time,
          end_time: result.end_time,
          max_patient_count: result.max_patient_count,
          consultation_type: result.consultation_type
        }
  
        this.slotService.createSlots(slot).subscribe(
          res => {
            Notiflix.Notify.Success("Slot Created !");
            this.getSlots();
          },
          err => {
            Notiflix.Notify.Failure("Error in creating slot !");
          }
        )
      }
    });
  }

}
