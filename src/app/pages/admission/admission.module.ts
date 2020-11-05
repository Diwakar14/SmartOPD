import { FormsModule } from '@angular/forms';
import { AdmitComponent } from 'src/app/components/admit/admit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionRoutingModule } from './admission-routing.module';
import { AdmissionComponent } from 'src/app/components/admission/admission.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AdmissionComponent,
    AdmitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdmissionRoutingModule,
    MatDialogModule,
    NgxPaginationModule
  ]
})
export class AdmissionModule { }
