import { NgxPaginationModule } from 'ngx-pagination';
import { StaffListComponent } from './../../components/staff-list/staff-list.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';


@NgModule({
  declarations: [StaffListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
