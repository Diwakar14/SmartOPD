import { DoctorFaqComponent } from './components/doctor-faq/doctor-faq.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqsComponent } from './faqs.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { PatientFaqComponent } from './components/patient-faq/patient-faq.component';
import { HomeFaqComponent } from './components/home-faq/home-faq.component';

const routes: Routes = [
  { 
    path: '', 
    component: FaqsComponent ,
    children:[
      {
        path:'',
        component: HomeFaqComponent
      },
      {
        path:'patient',
        component: PatientFaqComponent
      },
      {
        path:'doctor',
        component: DoctorFaqComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqsRoutingModule { }
