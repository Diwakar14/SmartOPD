import { AdmissionService } from './../../services/admission.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { take, debounceTime, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { fromEvent, Subscription } from 'rxjs';
import { CreateApptmntDialogComponent } from '../create-apptmnt-dialog/create-apptmnt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;

class Filter {
  start_date: any;
  end_date: any;
}

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit {
  filteredAdmissions = [];
  params: HttpParams;

  p: number = 1;
  total: number;
  loading: boolean= true;
  filter: Filter = new Filter();
  
  public config: PaginationInstance = {
    id: 'server',
    itemsPerPage: 20,
    currentPage: 1  
  };
  query: any;
  @ViewChild('search') searchFilter:ElementRef;

  searchSubscription = new Subscription();
  filterSubscription = new Subscription();
  
  constructor(private admissionService: AdmissionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPage(1); 
    // this.clear_filter();
    this.filter.end_date = '';
    this.filter.start_date = '';
    this.query = '';
    $('#admission_search').val('');
  }

  ngAfterViewInit(): void {
    this.searchSubscription = fromEvent(this.searchFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(1000),
        map((event: Event) => {
          this.query = (<HTMLInputElement>event.target).value
          if(this.filter.end_date || this.filter.start_date){
            this.params = new HttpParams()
            .set("start_date", this.filter.start_date != null ? this.filter.start_date : '')
            .set("end_date", this.filter.start_date != null ? this.filter.end_date : '')
            .set("q", this.query);
          }else{
            this.params = new HttpParams()
            .set("q", this.query);
          }
          return this.params;
        }),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.filteredAdmissions = [];
        }),
        switchMap(value => this.admissionService.getAdmissions(this.params))
      ).subscribe((res: any) => {
        this.filteredAdmissions = res.data.data;
        this.config.totalItems = res.data.total;
        this.loading = false;
      }, err => {
        this.filteredAdmissions = [];
        this.loading = false;
        this.config.totalItems = 0;
      }
    );
  }

  applyFilter(){
    this.loading = true;
    let filterData:any = {};
    if(this.filter.start_date || this.filter.end_date){
      filterData.start_date = this.filter.start_date;
      filterData.end_date = this.filter.end_date;
    }
    this.params = new HttpParams()
    .set('start_date', filterData.start_date || '')
    .set('end_date', filterData.end_date || '')
    .set('q', this.query || '');

    this.admissionService.getAdmissions(this.params).pipe(take(1)).subscribe((res: any) => {
      this.config.totalItems = res.data.total;
      this.config.itemsPerPage = res.data.per_page;
      this.loading = false;
      this.filteredAdmissions = res.data.data;
      console.log(this.filteredAdmissions)
    },
    err => {
      this.loading = false;
      this.filteredAdmissions = [];
      this.config.totalItems = 0;
    })
  }

  clear_filter(){
    this.filter.end_date = '';
    this.filter.start_date = '';
    this.query = '';
    this.getPage(1);
    $('#appointment_search').val('');
  }

  
  getPage(page: number) {
    this.loading = true;
    this.filteredAdmissions = [];
    if(this.filter.start_date || this.filter.end_date || this.query){
      this.params = new HttpParams()
      .set('start_date', this.filter.start_date || '')
      .set('end_date', this.filter.end_date || '')
      .set('q', this.query || '')
      .set('page', page + '' || '');
    }else{
      this.params = new HttpParams()
      .set('page', page + '' || '');
    }
    this.admissionService.getAdmissions(this.params).pipe(take(1)).subscribe(
      (res: any) => {
        this.config.totalItems = res.data.total;
        this.config.itemsPerPage = res.data.per_page;
        this.p = page;
        this.loading = false;
        this.filteredAdmissions = res.data.data;
      },
      err => {
        this.loading = false;
        this.config.totalItems = 0;
        this.filteredAdmissions = [];
      }
    );
  }

  showDetails(data){
    this.dialog.open(CreateApptmntDialogComponent, {
      width: '700px',
      height: '600px',
      data: {appointment: data, origin: 'admission'},
      disableClose: false,
      id: 'showDetails-admission'
    });
    this.dialog.getDialogById('showDetails-admission').afterClosed().subscribe((res: any) => {
      if(res == 1){
        this.ngOnInit();
      }
    })
  }

}
