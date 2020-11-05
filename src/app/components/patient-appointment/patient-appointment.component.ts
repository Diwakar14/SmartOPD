import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.scss']
})
export class PatientAppointmentComponent {
    @Input() patient;

    constructor() {
        
    }
}


