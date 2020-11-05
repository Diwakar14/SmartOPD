import { AuthGuard } from './services/authGuard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]  
  },
  { 
    path: 'faqs', 
    loadChildren: () => import('./pages/faqs/faqs.module').then(m => m.FaqsModule) 
  },
  { path: 'contacts', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
  { path: 'privacy', loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'terms', loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsModule) },

  { path: 'admissions', loadChildren: () => import('./pages/admission/admission.module').then(m => m.AdmissionModule) },
  { path: 'appointments', loadChildren: () => import('./pages/appointment/appointment.module').then(m => m.AppointmentModule) },
  { path: 'report', loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule) },
  { path: 'department', loadChildren: () => import('./pages/department/department.module').then(m => m.DepartmentModule) },
  { path: 'staff', loadChildren: () => import('./pages/staff/staff.module').then(m => m.StaffModule) },
  { path: 'notification', loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationModule) },
  
  { 
    path: '**', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
