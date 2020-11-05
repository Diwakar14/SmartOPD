import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportsComponent } from 'src/app/components/reports/reports.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
