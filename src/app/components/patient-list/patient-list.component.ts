import { debounceTime, delay } from 'rxjs/operators';
import { StateService } from 'src/app/services/state.service';
import { PatientService } from './../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  p:number = 1;
  loading = true;
  patients;
  filteredPatients: any = [];
  total: number;

  public config: PaginationInstance = {
    id: 'pagination2',
    itemsPerPage: 20,
    currentPage: 1  
  };

  constructor(private patientService: PatientService) { 
  }

  ngOnInit(): void {
    this.getPage(1);
  }

  searchPat(searchData){
    this.loading = true;
    let data = searchData.target.value.toLowerCase();
    this.patientService.searchPatients(data).pipe(
      debounceTime(1000),
    ).subscribe(
      (res:any) => {
        this.filteredPatients = res.data.data;
        this.config.totalItems = res.data.total;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  getPage(page: number) {
    this.loading = true;
    this.patientService.getPage(page).subscribe(
      (res: any) => {
        this.config.totalItems = res.data.total;
        this.config.itemsPerPage = res.data.per_page;
        this.p = page;
        this.loading = false;
        this.filteredPatients = res.data.data;
      }
    );
  }


}
