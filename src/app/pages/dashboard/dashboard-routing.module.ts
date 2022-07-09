import { BookAppointmentComponent } from 'src/app/components/book-appointment/book-appointment.component';
import { PatientProfileComponent } from 'src/app/components/patient-profile/patient-profile.component';
import { DocProfileComponent } from 'src/app/components/doc-profile/doc-profile.component';
import { AddPatientComponent } from 'src/app/components/add-patient/add-patient.component';
import { PatientListComponent } from 'src/app/components/patient-list/patient-list.component';
import { ContentComponent } from './../../components/content/content.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AddDoctorComponent } from 'src/app/components/add-doctor/add-doctor.component';
import { AuthGuard } from 'src/app/services/authGuard.service';
import { HomeComponent } from 'src/app/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Dashboard' }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Dashboard' }
      },
      {
        path: 'doctors',
        component: ContentComponent,
        data: { title: 'All Doctors' }
      },
      {
        path: 'doctor/add',
        component: AddDoctorComponent,
        data: { title: 'Add New Doctor' }
      },
      {
        path: 'doctor/:id',
        component: DocProfileComponent,
        data: { title: 'Doctors Profile' }
      },
      {
        path: 'patients',
        component: PatientListComponent,
        data: { title: 'ALl Patients' }
      },
      {
        path: 'patient/:id',
        component: PatientProfileComponent,
        data: { title: 'Patients Details' }
      },
      {
        path: 'patient/add',
        component: AddPatientComponent,
        data: { title: 'Add New Patient' }
      },
      {
        path: 'appointments',
        loadChildren: () => import('../appointment/appointment.module').then(m => m.AppointmentModule),
        data: { title: 'Appointments' }
      },
      {
        path: 'appointment',
        loadChildren: () => import('../appointment/appointment.module').then(m => m.AppointmentModule),
        data: { title: 'Book Appointments' }
      },
      {
        path: 'admissions',
        loadChildren: () => import('../admission/admission.module').then(m => m.AdmissionModule),
        data: { title: 'Admission' }
      },
      {
        path: 'admit',
        loadChildren: () => import('../admission/admission.module').then(m => m.AdmissionModule),
        data: { title: 'Admit' }
      },
      {
        path: 'patient/book/:id',
        component: BookAppointmentComponent,
        data: { title: 'patient' }
      },
      {
        path: 'doctor/book/:id',
        component: BookAppointmentComponent,
        data: { title: 'doctor' }
      },
      {
        path: 'departments',
        loadChildren: () => import('../department/department.module').then(m => m.DepartmentModule),
        data: { title: 'All Departments' }
      },
      {
        path: 'staff',
        loadChildren: () => import('../staff/staff.module').then(m => m.StaffModule),
        data: { title: 'All Departments' }
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationModule),
        data: { title: 'All Notification' }
      },
      {
        path: 'reports',
        loadChildren: () => import('../report/report.module').then(m => m.ReportModule),
        data: { title: 'All Reports' }
      },
      {
        path: 'faqs',
        loadChildren: () => import('../faqs/faqs.module').then(m => m.FaqsModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('../contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'terms',
        loadChildren: () => import('../terms/terms.module').then(m => m.TermsModule)
      },
      {
        path: 'privacy',
        loadChildren: () => import('../privacy/privacy.module').then(m => m.PrivacyModule)
      }
    ],
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
