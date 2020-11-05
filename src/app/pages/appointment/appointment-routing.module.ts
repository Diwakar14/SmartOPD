import { BookAppointmentComponent } from 'src/app/components/book-appointment/book-appointment.component';
import { AppntListComponent } from 'src/app/components/appnt-list/appnt-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { 
      path: '',
      component: AppntListComponent 
    },
    { 
      path: 'book',
      component: BookAppointmentComponent 
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
