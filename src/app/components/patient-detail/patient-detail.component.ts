
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {

  patientId;
  patient;
  constructor() { }

  ngOnInit(): void {
    
  }

}
