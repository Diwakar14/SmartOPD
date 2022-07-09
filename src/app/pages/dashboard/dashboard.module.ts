import { EditDocDialogComponent } from './../../components/edit-doc-dialog/edit-doc-dialog.component';
import { StaffListComponent } from './../../components/staff-list/staff-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PatientAppointmentComponent } from 'src/app/components/patient-appointment/patient-appointment.component';
import { DialogComponent } from './../../components/dialog/dialog.component';
import { AddDoctorComponent } from './../../components/add-doctor/add-doctor.component';
import { DepartmentListComponent } from './../../components/department-list/department-list.component';
import { ContentComponent } from './../../components/content/content.component';
import { SidebarComponent } from './../../components/sidebar/sidebar.component';
import { ToolbarComponent } from './../../components/toolbar/toolbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';


import { MatDialogModule } from '@angular/material/dialog';

import { DocProfileDialogComponent } from 'src/app/components/doc-profile-dialog/doc-profile-dialog.component';
import { CreateSlotDialogComponent } from 'src/app/components/create-slot-dialog/create-slot-dialog.component';
import { DoctorDetailsComponent } from 'src/app/components/doctor-details/doctor-details.component';
import { MatRadioModule } from '@angular/material/radio';
import { ImageCropperModule } from 'ngx-image-cropper';


import { HomeComponent } from 'src/app/components/home/home.component';
import { FormateTimePipe } from 'src/app/pipes/formate-time.pipe';
import { CreateApptmntDialogComponent } from 'src/app/components/create-apptmnt-dialog/create-apptmnt-dialog.component';
import { PatientListComponent } from 'src/app/components/patient-list/patient-list.component';
import { PatientDetailComponent } from 'src/app/components/patient-detail/patient-detail.component';
import { AddPatientComponent } from 'src/app/components/add-patient/add-patient.component';
import { AppointmentsComponent } from 'src/app/components/appointments/appointments.component';
import { BookingsComponent } from 'src/app/components/bookings/bookings.component';
import { AboutDoctorComponent } from 'src/app/components/about-doctor/about-doctor.component';
import { HolidayDoctorComponent } from 'src/app/components/holiday-doctor/holiday-doctor.component';
import { AppntListComponent } from 'src/app/components/appnt-list/appnt-list.component';
import { AddSlotComponent } from 'src/app/components/add-slot/add-slot.component';
import { DocProfileComponent } from 'src/app/components/doc-profile/doc-profile.component';
import { DocBasicProfileComponent } from 'src/app/components/doc-basic-profile/doc-basic-profile.component';
import { ChartCardComponent } from 'src/app/components/chart-card/chart-card.component';
import { PatientProfileComponent } from 'src/app/components/patient-profile/patient-profile.component';
import { BookAppointmentComponent } from 'src/app/components/book-appointment/book-appointment.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { PrivacyComponent } from 'src/app/components/privacy/privacy.component';
import { TermsComponent } from 'src/app/components/terms/terms.component';
import { ContactComponent } from 'src/app/components/contact/contact.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { EditSlotDialogComponent } from 'src/app/components/edit-slot-dialog/edit-slot-dialog.component';
import { DeleteSlotDialogComponent } from 'src/app/components/delete-slot-dialog/delete-slot-dialog.component';
import { CofirmCreateHolidayDialogComponent } from 'src/app/components/cofirm-create-holiday-dialog/cofirm-create-holiday-dialog.component';
import { CancelHolidayDialogComponent } from 'src/app/components/cancel-holiday-dialog/cancel-holiday-dialog.component';
import { ConfirmSendNoticeDialogComponent } from 'src/app/components/confirm-send-notice-dialog/confirm-send-notice-dialog.component';
import { DelDocDialogComponent } from 'src/app/components/del-doc-dialog/del-doc-dialog.component';
import { ReportsComponent } from 'src/app/components/reports/reports.component';
import { CancelAppointmentComponent } from 'src/app/components/cancel-appointment/cancel-appointment.component';
import { ActivateDoctorDialogComponent } from 'src/app/components/activate-doctor-dialog/activate-doctor-dialog.component';
import { InstantNotificationDialogComponent } from 'src/app/components/instant-notification-dialog/instant-notification-dialog.component';
import { RecheduleAppDialogComponent } from 'src/app/components/rechedule-app-dialog/rechedule-app-dialog.component';
import { CopyDialogComponent } from 'src/app/components/copy-dialog/copy-dialog.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    SidebarComponent,
    ContentComponent,
    AddDoctorComponent,
    DialogComponent,
    DocProfileDialogComponent,
    CreateSlotDialogComponent,
    DoctorDetailsComponent,
    HomeComponent,
    FormateTimePipe,
    CreateApptmntDialogComponent,
    PatientListComponent,
    PatientDetailComponent,
    AddPatientComponent,
    AppointmentsComponent,
    BookingsComponent,
    AboutDoctorComponent,
    HolidayDoctorComponent,
    PatientAppointmentComponent,
    AddSlotComponent,
    DocProfileComponent,
    DocBasicProfileComponent,
    ChartCardComponent,
    PatientProfileComponent,
    AlertDialogComponent,
    PrivacyComponent,
    TermsComponent,
    ContactComponent,
    EditDocDialogComponent,
    EditSlotDialogComponent,
    DeleteSlotDialogComponent,
    CofirmCreateHolidayDialogComponent,
    CancelHolidayDialogComponent,
    ConfirmSendNoticeDialogComponent,
    DelDocDialogComponent,
    CancelAppointmentComponent,
    ActivateDoctorDialogComponent,
    InstantNotificationDialogComponent,
    RecheduleAppDialogComponent,
    CopyDialogComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    NgxPaginationModule,
    ImageCropperModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    NgApexchartsModule
  ]
})
export class DashboardModule { }
