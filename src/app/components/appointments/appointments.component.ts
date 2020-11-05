import { RecheduleAppDialogComponent } from 'src/app/components/rechedule-app-dialog/rechedule-app-dialog.component';
import { InstantNotificationDialogComponent } from 'src/app/components/instant-notification-dialog/instant-notification-dialog.component';
import { StateService } from 'src/app/services/state.service';
import { CreateApptmntDialogComponent } from 'src/app/components/create-apptmnt-dialog/create-apptmnt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingsComponent } from 'src/app/components/bookings/bookings.component';
import { environment } from './../../../environments/environment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  appointmentDates = [];
  bookingDate = '';
  appointments = [];
  loading = true;
  loadingDates = true;
  allbookings = [];
  showFiller = false;
  slots: any = [];

  rescheduleData: any = {};

  @Input() doctorId;
  @Input() active;

  docDeleted: any = false;
  constructor(private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private stateService: StateService
  ) {

  }


  ngOnInit(): void {
    this.getDates();
    this.stateService.currentApprovalrefreshStateMessage.subscribe((res: any) => {
      this.getDates();
    });
    this.stateService.currentApprovalDelDocMessage.subscribe((res: any) => {
      this.docDeleted = !JSON.parse(res);
    });
  }

  getDates() {
    this.loading = true;
    this.appointmentService.getAppointmentsForADoc(this.doctorId, true)
      .subscribe(
        (res: any) => {
          this.appointmentDates = res.dates;
          this.loading = false;
          if (this.appointmentDates.length > 0)
            this.bookingDate = this.appointmentDates[0].db_date;

          this.appointmentService.getBookingForADoc(this.doctorId, this.bookingDate).subscribe(
            (res: any) => {
              this.slots = res.slots;
              this.loading = false;
            },
            err => {
              this.loading = false;
            }
          );
        },
        err => {
          // console.log(err);
          if (err.error.message == 'No Bookings') {
            this.appointmentDates = [];
            this.slots = [];
          }
          this.loading = false;
        }
      );
  }

  showAppForASlot(appointments, index, slot) {
    this.appointments = appointments;
    this.addActiveClassToSlot(index);
    this.rescheduleData = { slot: slot, bookingDate: this.bookingDate }
  }

  showBookingForADay(data) {
    this.allbookings = data;
  }


  showBookings(date, event) {
    this.loading = true
    this.bookingDate = date;
    this.slots = [];
    this.appointments = [];
    this.appointmentService.getBookingForADoc(this.doctorId, this.bookingDate).subscribe(
      (res: any) => {
        this.slots = res.slots;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    )
    this.addActiveClass(event);
  }

  notifyAll() {
    this.dialog.open(InstantNotificationDialogComponent, {
      width: '450px',
      data: { appointments: this.rescheduleData },
      disableClose: false,
      id: 'instant-notify-dialog'
    })
  }
  reschedule() {
    this.dialog.open(RecheduleAppDialogComponent, {
      width: '450px',
      data: { reschedule: this.rescheduleData },
      disableClose: false,
      id: 'instant-notify-dialog'
    })
  }

  showDetails(data) {
    this.dialog.open(CreateApptmntDialogComponent, {
      width: '700px',
      height: '600px',
      data: { appointment: data },
      disableClose: false,
      id: 'showDetails-doc-profile'
    });
  }
  addActiveClass(index) {
    let items = document.querySelectorAll(".tab-item");
    items.forEach(item => item.classList.remove('activeDate'));
    let itemActive = document.querySelector('#date_' + index);
    itemActive.classList.add('activeDate');
  }
  addActiveClassToSlot(index) {
    let items = document.querySelectorAll(".slot");
    items.forEach(item => item.classList.remove('activeSlot'));
    let itemActive = document.querySelector('#slot_' + index);
    itemActive.classList.add('activeSlot');
  }

}
