import { DoctorService } from 'src/app/services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-profile',
  templateUrl: './doc-profile.component.html',
  styleUrls: ['./doc-profile.component.scss']
})
export class DocProfileComponent implements OnInit {
  doctorData;
  constructor(
      private activatedRoute: ActivatedRoute,
      private doctorService: DoctorService
    ) { }

  doctorId;
  ngOnInit(): void {
    this.doctorId = this.activatedRoute.snapshot.paramMap.get('id');
    this.doctorService.getDoctor(this.doctorId).subscribe(
      (res: any) => {
        this.doctorData = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  reload(e){
    if(e.reload){
      this.ngOnInit();
    }
  }
}
