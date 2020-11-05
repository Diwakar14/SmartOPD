import { DepartmentListComponent } from './../../components/department-list/department-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DepartmentListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DepartmentRoutingModule
  ]
})
export class DepartmentModule { }
