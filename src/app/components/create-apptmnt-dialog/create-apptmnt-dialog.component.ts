import { CopyDialogComponent } from './../copy-dialog/copy-dialog.component';
import { take, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CancelAppointmentComponent } from './../cancel-appointment/cancel-appointment.component';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
declare var Notiflix: any;
import * as jwt_decode from 'jwt-decode';
import { AdmissionService } from 'src/app/services/admission.service';
@Component({
  selector: 'app-create-apptmnt-dialog',
  templateUrl: './create-apptmnt-dialog.component.html',
  styleUrls: ['./create-apptmnt-dialog.component.scss']
})
export class CreateApptmntDialogComponent implements OnInit, OnDestroy {
  confirmBooking;
  consultation_fees = '';
  current_token = '';
  approx_time = '';
  loading = false;
  confirmRefund = false;
  role: any;
  refundMessage: any;

  flag = 0;

  appointmentSubscription = new Subscription();
  refundSubscription = new Subscription();
  cancelSubscription = new Subscription();
  constructor(
    public dialogRef: MatDialogRef<CreateApptmntDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dailog: MatDialog,
    private cookie: CookieService,
    private appService: AppointmentService,
    private admissionService: AdmissionService
  ) { }


  ngOnInit(): void {
    this.loading = true;

    var decoded = jwt_decode(this.cookie.get('auth_token'));
    this.role = decoded.allowed[0];
    if (this.data.origin == 'admission') {
      this.appointmentSubscription = this.admissionService.getAdmission(this.data.appointment.id)
        .pipe(take(1), delay(2000))
        .subscribe((res: any) => {
          this.confirmBooking = res.appointment;
          this.confirmBooking.isSelfBooking = true;
          this.consultation_fees = res.appointment.payment.amount;
          this.current_token = res.appointment.current_token;
          this.approx_time = res.appointment.approx_time;
          this.loading = false;
        }, err => {
          this.dialogRef.close(this.flag);
          Notiflix.Notify.Failure("Something Went Wrong.");
        });
    } else {
      this.appointmentSubscription = this.appService.getAppointment(this.data.appointment.id).subscribe((res: any) => {
        this.confirmBooking = res.appointment;
        console.log(this.confirmBooking);
        this.consultation_fees = res.appointment.payment.amount;
        this.current_token = res.appointment.current_token;
        this.approx_time = res.appointment.approx_time;
        this.loading = false;
      }, err => {
        this.dialogRef.close(this.flag);
        Notiflix.Notify.Failure("Something Went Wrong.");
      });
    }
  }

  copyLink(link) {
    this.dailog.open(CopyDialogComponent, {
      width: '400px',
      id: 'copy-link',
      data: { link: link }
    });
  }

  completed() {
    this.loading = true;
    let completeBody = {
      status: 'Completed',
      booking_id: this.confirmBooking.booking_id,
    }
    this.appService.getAppointmentStatus(completeBody)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res.success == 1) {
          this.ngOnInit();
          this.flag = 1;
        }
      }, err => {
        this.loading = false;
        Notiflix.Notify.Failure(err.message);
      });
  }


  print() {
    var data = document.getElementById('contentToConvert');
    var WinPrint = window.open('', '', 'width=793,height=650');
    WinPrint.document.write(data.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();

    setTimeout(() => {
      WinPrint.close();
    }, 2000);
  }

  completeRefund() {
    this.confirmRefund = true;
    let refund = {
      booking_id: this.confirmBooking.booking_id
    }
    this.refundSubscription = this.appService.initiateRefund(refund).subscribe((res: any) => {
      // console.log(res);
      if (res.status == 200) {
        Notiflix.Notify.Success(res.body.message);
        this.flag = 1;
        this.ngOnInit();
      } else if (res.status == 400) {
        Notiflix.Notify.Success(res.body.message);
        this.flag = 1;
        this.ngOnInit();
      }
      this.confirmRefund = false;
    }, err => {
      this.confirmRefund = false;
      Notiflix.Notify.Failure(err.error.message);
    });
  }

  cancel_appointment() {
    this.dailog.open(CancelAppointmentComponent, {
      width: '450px',
      disableClose: true,
      id: 'confirm-cancel-appnt'
    });



    this.dailog.getDialogById('confirm-cancel-appnt').afterClosed().subscribe((res: any) => {
      if (res.confirm) {
        let cancelBody = {
          status: 'Cancelled',
          booking_id: this.confirmBooking.booking_id,
          password: res.data.password,
          reason: res.data.reason
        }
        this.cancelSubscription = this.appService.getAppointmentStatus(cancelBody).subscribe((res: any) => {
          if (res.success == 1) {
            this.ngOnInit();
            this.flag = 1;
          }
        }, err => {
          this.loading = false;
          Notiflix.Notify.Failure(err.message);
        });
      }
    })
  }

  close_dialog() {
    this.dialogRef.close(this.flag);
  }

  ngOnDestroy(): void {
    this.appointmentSubscription.unsubscribe();
    this.refundSubscription.unsubscribe();
    this.cancelSubscription.unsubscribe();
  }
}
