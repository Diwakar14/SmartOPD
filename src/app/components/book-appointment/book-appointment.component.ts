import { ConfirmAppointmentDialogComponent } from 'src/app/components/confirm-appointment-dialog/confirm-appointment-dialog.component';
import { CreateSlotDialogComponent } from 'src/app/components/create-slot-dialog/create-slot-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateApptmntDialogComponent } from 'src/app/components/create-apptmnt-dialog/create-apptmnt-dialog.component';
import { PatientService } from 'src/app/services/patient.service';
import { SlotService } from 'src/app/services/slot.service';
import { debounceTime, map, take, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, fromEvent, of } from 'rxjs';
declare var Notiflix: any;
declare var $: any;

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedDocCard = {
    photo: null,
    name: '',
    designation: '',
    isSelected: false
  }
  selectedPatCard = {
    photo: null,
    name: '',
    phone: '',
    isSelected: false
  }

  appointmentDates = [];
  bookingDate = '';
  appointments = [];
  allbookings = [];
  showFiller = false;
  slots: any;
  loading = true;
  loadingslots = true;
  loadingSearchDataDoc = false;
  loadingSearchDataPat = false;

  step1 = true;
  step2 = true;
  step3 = true;

  blocker = {
    slot: true,
    confirm: true
  }

  info = {
    doctor: true,
    patient: true,
    slot: true,
    date: true
  }

  confirm = false;
  doctor;
  patient;
  slot = {
    id: '',
    type: '',
    start: '',
    date: ''
  };

  online = [];
  offline = [];

  offline_fees;
  online_fees;

  confirmBooking;
  consultation_fees: any;
  current_token: any;
  approx_time: any;

  filteredDoctors = [];
  filteredPatient = [];

  dateSubscription = new Subscription();
  searchDocSubscription = new Subscription();
  searchPatSubscription = new Subscription();

  @ViewChild('searchDoctorApp') searchDoctorApp: ElementRef<HTMLInputElement>;
  @ViewChild('searchPatientApp') searchPatientApp: ElementRef<HTMLInputElement>;

  @Input() doctorId;
  app: any = {};

  constructor(private appointmentService: AppointmentService,
    private slotService: SlotService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private patientService: PatientService,
    private doctorService: DoctorService) {

  }


  ngAfterViewInit(): void {
    this.searchDocSubscription = fromEvent(this.searchDoctorApp.nativeElement, "keyup")
      .pipe(
        debounceTime(1000),
        map((event: Event) => {
          return (<HTMLInputElement>event.target).value
        }),
        tap(() => {
          this.loadingSearchDataDoc = true;
        }),
        switchMap(value => this.doctorService.searchDoctors(value).pipe(catchError(err => of({ data: [] }))))
      ).subscribe((res: any) => {
        this.filteredDoctors = res.data;
        this.loadingSearchDataDoc = false;
      }, err => {
        this.filteredDoctors = [];
        this.loadingSearchDataDoc = false;
      }
      );
    this.searchPatSubscription = fromEvent(this.searchPatientApp.nativeElement, "keyup")
      .pipe(
        debounceTime(1000),
        map((event: Event) => {
          return (<HTMLInputElement>event.target).value
        }),
        tap(() => {
          this.loadingSearchDataPat = true;
        }),
        switchMap(value => this.patientService.searchPatients(value).pipe(catchError(err => of({ data: [] }))))
      ).subscribe((res: any) => {
        this.filteredPatient = res.data.data;
        this.loadingSearchDataPat = false;
      }, err => {
        this.filteredPatient = [];
        this.loadingSearchDataPat = false;
      }
      );

  }

  ngOnInit(): void {
    let user = this.activateRoute.snapshot.data.title;
    let id = this.activateRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.loadingslots = false;
    }
    if (user == 'patient') {
      this.patientService.getPatient(id).pipe(take(1)).subscribe(
        (res: any) => {
          this.selectPatient(res.patient);
          this.loading = false;
          this.loadingslots = false;
        }
      )
    } else if (user == 'doctor') {
      this.doctorService.getDoctor(id).pipe(take(1)).subscribe(
        (res: any) => {
          this.selectCard({
            doctor: {
              photo: res.doctor.photo,
              name: res.doctor.name,
            },
            isActive: res.doctor.doctor_detail.isActive,
            designation: res.doctor.doctor_detail.designation,
            doctor_id: res.doctor.doctor_detail.doctor_id
          });
          this.loading = false;
          this.loadingslots = false;
        }
      )
    }
  }
  addPatient() {
    this.dialog.open(CreateSlotDialogComponent, {
      width: '450px',
      data: { origin: 'appointment', type: 'create' },
      id: 'createPatient',
      disableClose: true
    });

    this.dialog.getDialogById('createPatient').afterClosed().subscribe(
      (data: any) => {
        console.log(data);
        if (data.patient != null || data.patient != undefined)
          this.selectPatient(data.patient);
      }
    )
  }

  showBookingForADay(data) {
    this.allbookings = data;
  }


  selectPatient(patient) {
    this.filteredPatient = [];
    this.patient = patient;
    this.selectedPatCard = patient;
    this.selectedPatCard.isSelected = true;

    if (this.info.slot == false) {
      this.blocker.confirm = false;
    }
    this.info.patient = false;
    $('#searchPat').val('');
  }


  selectCard(data) {
    this.filteredDoctors = [];
    this.doctor = data;
    if (!this.doctor.isActive) {
      Notiflix.Notify.Warning("This Doctor is not active");
    } else {
      this.selectedDocCard.designation = data.designation;
      this.selectedDocCard.photo = data.doctor.photo;
      this.selectedDocCard.name = data.doctor.name;
      this.selectedDocCard.isSelected = true;
      this.doctorId = data.doctor_id;
      this.selectDateOfDoc(data.doctor_id);
      this.doctorService.getDoctor(this.doctorId).pipe(take(1)).subscribe(
        (res: any) => {
          this.offline_fees = res.doctor.doctor_detail.offline_fees;
          this.online_fees = res.doctor.doctor_detail.online_fees;
        }
      )
      this.blocker.slot = false;
      this.info.doctor = false;
      this.step2 = false;
    }
    $('#searchDoc').val('');
  }

  selectDateOfDoc(doctorId) {
    this.loadingslots = true;
    this.slotService.getSlots(doctorId).pipe(take(1)).subscribe(
      (res: any) => {
        console.log(res);
        this.appointmentDates = res.available_slots;
        let date = this.appointmentDates[0];
        this.slot.date = date.date;
        this.online = date.online_slots == undefined ? [] : date.online_slots;
        this.offline = date.offline_slots == undefined ? [] : date.offline_slots;
        setTimeout(() => {
          if (this.offline.length > 0) {
            this.selectedSlot(this.offline[0], 0, 2);
          } else if (this.online.length > 0) {
            // Enable online slots...
            this.selectedSlot(this.online[0], 0, 1);
          }
        }, 100);
        this.info.date = false;
        this.info.slot = true;
        this.loadingslots = false;
      },
      err => {
        this.appointmentDates = [];
        this.online = [];
        this.offline = [];
        this.slot.date = '';
        this.blocker.slot = true;
        this.info.doctor = true;
        this.loadingslots = false;
        this.selectedDocCard.isSelected = false;
        Notiflix.Notify.Warning("Seleted Doctor has no Dates");
      }
    );
  }

  selectedSlot(slot, i, type) {
    this.slot.id = slot.id;
    this.slot.start = slot.start;
    this.slot.type = type == 1 ? 'Online' : 'Offline';
    this.addSlotActive(i);
    this.info.slot = false;
    if (this.info.patient == false) {
      this.blocker.confirm = false;
      this.step3 = false;
    }
  }

  showBookings(date: any, event) {
    this.slots = [];
    this.slot.date = date.date;
    this.online = date.online_slots == undefined ? [] : date.online_slots;
    this.offline = date.offline_slots == undefined ? [] : date.offline_slots;
    setTimeout(() => {
      if (this.offline.length > 0) {
        this.selectedSlot(this.offline[0], 0, 2);
        this.info.slot = false;
        if (this.info.patient == false) {
          this.blocker.confirm = false;
          this.step3 = false;
        }
      } else if (this.online.length > 0) {
        // Enables online slots highlights.
        this.selectedSlot(this.online[0], 0, 1);
        this.info.slot = false;
        if (this.info.patient == false) {
          this.blocker.confirm = false;
          this.step3 = false;
        }
      } else {
        this.info.slot = true;
        this.blocker.confirm = true;
      }
    }, 100);
    this.addActiveClass(event);
    this.info.date = false;
    this.info.slot = true;
  }

  addSlotActive(index) {
    let items = document.querySelectorAll(".slot");
    items.forEach(item => item.classList.remove('activeSlot'));
    let itemActive = document.querySelector('#slot_' + index);
    itemActive.classList.add('activeSlot');
  }

  addActiveClass(index) {
    let items = document.querySelectorAll(".tab-item");
    items.forEach(item => item.classList.remove('activeDate'));
    let itemActive = document.querySelector('#date_' + index);
    itemActive.classList.add('activeDate');
  }

  checkSlotAvailability() {
    this.confirm = true;
  }
  confirmBook(status?) {
    this.confirm = true;

    this.app = {
      doctor: this.doctorId,
      slot: this.slot.id,
      patient: this.patient.id,
      offline_payment: true
    }
    if (status == 203) this.app.override_slot = 1;

    this.appointmentService.createAppointment(this.app).pipe(take(1)).subscribe(
      (res: any) => {
        if (res.status === 203) {
          console.log("Open dialog...");
          this.dialog.open(ConfirmAppointmentDialogComponent, {
            width: '420px',
            data: { message: res.body.message },
            disableClose: true,
            id: 'confirmBookingApp'
          });
          this.dialog.getDialogById('confirmBookingApp').afterClosed().subscribe((res: any) => {
            if (res.confirm == true) {
              this.confirmBook(203);
            } else {
              this.confirm = false;
            }
          })
          return;
        }

        this.appointmentService.getAppointment(res.body.appointment.id).pipe(take(1)).subscribe((res: any) => {
          this.confirmBooking = res.appointment;
          this.consultation_fees = res.appointment.payment.amount;
          this.current_token = res.appointment.current_token;
          this.approx_time = res.appointment.approx_time;
          this.confirm = false;

          setTimeout(() => {
            this.print();
          }, 1000);

        }, err => {
          Notiflix.Notify.Failure(err.error.message);
        });

        this.appointmentDates = [];
        this.online = [];
        this.offline = [];
        this.slot.date = '';

        this.blocker.slot = true;
        this.blocker.confirm = true;

        this.info.doctor = true;
        this.info.patient = true;
        this.info.slot = true;
        this.info.date = true;

        this.step2 = true;
        this.step3 = true;

        this.selectedDocCard.isSelected = false;
        this.selectedPatCard.isSelected = false;

        $('#searchDoc').val('');
        $('#searchPat').val('');
      },
      err => {
        this.confirm = false;
        Notiflix.Notify.Failure(err.error.message)
      }
    )
  }
  print() {
    var data = document.getElementById('contentToConvertFromApp');
    var WinPrint = window.open('', '', 'width=793,height=650');
    WinPrint.document.write(data.innerHTML);
    this.confirmBooking = null;
    this.consultation_fees = null;
    this.current_token = null;
    this.approx_time = null;
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();

    setTimeout(() => {
      WinPrint.close();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.searchDocSubscription.unsubscribe();
    this.searchPatSubscription.unsubscribe();
  }
}
