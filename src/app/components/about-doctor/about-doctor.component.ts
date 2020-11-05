import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-about-doctor',
  templateUrl: './about-doctor.component.html',
  styleUrls: ['./about-doctor.component.scss']
})
export class AboutDoctorComponent implements OnInit {

  @Input() doctor;
  constructor() { }

  ngOnInit(): void {
  }

}
