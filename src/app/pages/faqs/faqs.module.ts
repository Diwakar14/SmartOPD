import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';
import { HomeFaqComponent } from './components/home-faq/home-faq.component';
import { DoctorFaqComponent } from './components/doctor-faq/doctor-faq.component';
import { PatientFaqComponent } from './components/patient-faq/patient-faq.component';


@NgModule({
  declarations: [
    FaqsComponent,
    HomeFaqComponent,
    DoctorFaqComponent,
    PatientFaqComponent,
  ],
  imports: [
    CommonModule,
    FaqsRoutingModule,
  ]
})
export class FaqsModule { }
