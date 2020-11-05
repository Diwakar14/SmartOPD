import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmitComponent } from 'src/app/components/admit/admit.component';
import { AdmissionComponent } from 'src/app/components/admission/admission.component';

const routes: Routes = [
  { 
    path: '', 
    component: AdmissionComponent,
    data: {title: 'Admission'}
  },
  { 
    path: 'patient', 
    component: AdmitComponent,
    data: {title: 'Admit'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionRoutingModule { }
