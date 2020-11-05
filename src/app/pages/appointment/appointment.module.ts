import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppntListComponent } from 'src/app/components/appnt-list/appnt-list.component';
import { BookAppointmentComponent } from 'src/app/components/book-appointment/book-appointment.component';
import { ConfirmAppointmentDialogComponent } from 'src/app/components/confirm-appointment-dialog/confirm-appointment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppntListComponent,
    BookAppointmentComponent,
    ConfirmAppointmentDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MatDialogModule,
    AppointmentRoutingModule
  ]
})
export class AppointmentModule { }
