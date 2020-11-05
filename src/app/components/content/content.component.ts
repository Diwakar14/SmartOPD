import { CookieService } from 'ngx-cookie-service';
import { StateService } from './../../services/state.service';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from './../../services/doctor.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DocProfileDialogComponent } from '../doc-profile-dialog/doc-profile-dialog.component';
import { debounce, debounceTime, map, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { Subscription, fromEvent, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

declare var $:any;
declare var Notiflix: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy {

  doctors: any[] = [];
  loading = true;
  filteredDoctors: any = [];
  search_field: any;
  role: any;
  
  @ViewChild('searchDoctor') searchFilter:ElementRef;
  searchSubscription = new Subscription();
  constructor(
    private doctor: DoctorService, 
    private cookie: CookieService,
    private dialog: MatDialog) {
  }
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.searchSubscription = fromEvent(this.searchFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.filteredDoctors = [];
        }),
        map((event: Event) => {
          this.search_field = (<HTMLInputElement>event.target).value;
          return this.search_field;
        }),
        switchMap(value => this.doctor.searchDoctors(this.search_field).pipe(catchError(err => of({data:[]}))))
      ).subscribe((res: any) => {
        this.doctors = res.data;
        this.filteredDoctors = this.doctors;
        this.loading = false;
      }, err => {
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];

    this.doctor.getDoctors().subscribe(
      (res: any) => {
        this.doctors = res.data;
        this.filteredDoctors = this.doctors;
        this.loading = false;
      },err => {
        this.loading = false;
      }
    )
  }

  deleteDoc(doc){
    this.doctor.deleteDoctor(doc.id).subscribe(
      res => {
        Notiflix.Notify.Success("Doctor removed from the System");
        this.ngOnInit()
      },
      err => {
        Notiflix.Notify.Failure("Error removing doctor from the system, check you internet connection.");
      }
    )
  }

  openDialog(doctor): void {
    const dialogRef = this.dialog.open(DocProfileDialogComponent, {
      width: '100%',
      data: {doctor: doctor}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
