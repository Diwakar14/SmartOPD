import { DoctorService } from './../../services/doctor.service';
import { PatientService } from './../../services/patient.service';
import { StaffService } from './../../services/staff.service';
import { ReportService } from './../../services/report.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { HttpParams, HttpEventType } from '@angular/common/http';
import { debounceTime, map, catchError, take, distinctUntilChanged } from 'rxjs/operators';
declare var $: any;
declare var Tagify: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  reportQuery = 'Daily';
  departments = [];
  staff = [];
  report = {
    today: false,
    start_date: '',
    id: '',
    end_date: '',
    email: '',
    sendToAllAdmin: false
  }

  emails: any;

  @ViewChild('download') download: ElementRef;
  loading: boolean = false;
  filteredStaff: any = [];
  filteredPat: any = [];
  filteredDoc: any = [];
  sortedStaff = [];
  sortedDoc = [];
  sortedPat = [];
  loadingSearch: boolean;
  progress = {
    width: '',
    completed: false
  };
  reportType: any;
  constructor(private deptSevice: DepartmentService,
    private staffSer: StaffService,
    private docSer: DoctorService,
    private patSer: PatientService,
    private reportService: ReportService) {
    let date = new Date();
    let month = date.getMonth() + 1;

    if (month < 10) {
      this.report.start_date = `${date.getFullYear()}-0${month}-${date.getDate()}`;
    } else if (date.getDate() < 10) {
      this.report.start_date = `${date.getFullYear()}-${month}-0${date.getDate()}`;
    } else {
      this.report.start_date = `${date.getFullYear()}-${month}-${date.getDate()}`;
    }
  }

  ngOnInit(): void {
    let input = document.querySelector('#report_email');
    this.emails = new Tagify(input);
  }

  getReport(f: NgForm) {
    let report: any = {};
    this.loading = true;

    if (this.report.today) {
      this.report.start_date = ''
      this.report.end_date = ''
    } else {
      report.start_date = this.report.start_date;
      report.end_date = this.report.end_date;
    }

    report.mail_to_admins = this.report.sendToAllAdmin;

    if (this.reportQuery == 'Staff' && (this.reportType == 'revenue' || this.reportType == 'instant')) {

      if (this.emails.value.length > 0) {
        report.emails = [...this.emails.value.map(i => i.value)];
      }
      if (this.sortedStaff.length > 0) {
        report.staff = [...this.sortedStaff.map(i => i.id)]
      }
      if (this.reportType == 'revenue') {
        this.reportService.getStaffReport(report).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.DownloadProgress:
                let progress = Math.round(event.loaded * 100 / event.total);
                this.progress.width = progress + '%';
                this.progress.completed = true;
                break;
              case HttpEventType.Response:
                this.downLoadFile(event.body, 'application/pdf');
                this.loading = false;
                this.progress.completed = false;
                f.reset();
                this.sortedStaff = [];
                if (this.emails.value != undefined)
                  this.emails.removeAllTags();

                return event;
            }
          }),
          catchError((err => {
            this.loading = false;
            this.progress.completed = false;
            return 'Download Failed !';
          }))
        ).subscribe((event: any) => {
          if (typeof (event) === 'object') {
            console.log("Done")
          }
        }
        )
      } else if (this.reportType == 'instant') {
        this.reportService.getInsantStaffRevReport(report).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.DownloadProgress:
                let progress = Math.round(event.loaded * 100 / event.total);
                this.progress.width = progress + '%';
                this.progress.completed = true;
                break;
              case HttpEventType.Response:
                this.downLoadFile(event.body, 'application/pdf');
                this.loading = false;
                this.progress.completed = false;
                f.reset();
                this.sortedStaff = [];
                if (this.emails.value != undefined)
                  this.emails.removeAllTags();

                return event;
            }
          }),
          catchError((err => {
            this.loading = false;
            this.progress.completed = false;
            return 'Download Failed !';
          }))
        ).subscribe((event: any) => {
          if (typeof (event) === 'object') {
            console.log("Done")
          }
        }
        )
      }

    } else if (this.reportQuery == 'Daily' && (this.reportType == 'revenue' || this.reportType == 'instant' || this.reportType == 'summary')) {
      let report: any = {};
      report.mail_to_admins = this.report.sendToAllAdmin;

      if (this.report.start_date)
        report.date = this.report.start_date;

      if (this.emails.value.length > 0)
        report.emails = [...this.emails.value.map(i => i.value)];



      if (this.reportType == 'revenue') {
        this.reportService.getDailyReport(report).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.DownloadProgress:
                let progress = Math.round(event.loaded * 100 / event.total);
                this.progress.width = progress + '%';
                this.progress.completed = true;
                break;
              case HttpEventType.Response:
                this.downLoadFile(event.body, 'application/pdf');
                this.loading = false;
                this.progress.completed = false;
                f.reset();
                this.sortedStaff = [];
                if (this.emails.value != undefined)
                  this.emails.removeAllTags();
                return event;
            }
          }),
          catchError((err => {
            this.loading = false;
            this.progress.completed = false;
            return 'Download Failed !';
          }))
        ).subscribe((event: any) => {
          if (typeof (event) === 'object') {
            console.log("Done")
          }
        }
        )
      } else if (this.reportType == 'instant') {
        this.reportService.getInstantDailyRevReport(report).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.DownloadProgress:
                let progress = Math.round(event.loaded * 100 / event.total);
                this.progress.width = progress + '%';
                this.progress.completed = true;
                break;
              case HttpEventType.Response:
                this.downLoadFile(event.body, 'application/pdf');
                this.loading = false;
                this.progress.completed = false;
                f.reset();
                this.sortedStaff = [];
                if (this.emails.value != undefined)
                  this.emails.removeAllTags();
                return event;
            }
          }),
          catchError((err => {
            this.loading = false;
            this.progress.completed = false;
            return 'Download Failed !';
          }))
        ).subscribe((event: any) => {
          if (typeof (event) === 'object') {
            console.log("Done")
          }
        }
        )
      } else if (this.reportType == 'summary') {
        // Summary Report.

        this.reportService.getDailySummaryReport(report).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.DownloadProgress:
                let progress = Math.round(event.loaded * 100 / event.total);
                this.progress.width = progress + '%';
                this.progress.completed = true;
                break;
              case HttpEventType.Response:
                this.downLoadFile(event.body, 'application/pdf');
                this.loading = false;
                this.progress.completed = false;
                f.reset();
                this.sortedStaff = [];
                if (this.emails.value != undefined)
                  this.emails.removeAllTags();
                return event;
            }
          }),
          catchError((err => {
            this.loading = false;
            this.progress.completed = false;
            return 'Download Failed !';
          }))
        ).subscribe((event: any) => {
          if (typeof (event) === 'object') {
            console.log("Done")
          }
        }
        )
      }

    } else if (this.reportQuery == 'Daily' && this.reportType == 'cancellation') {
      let report: any = {};
      report.mail_to_admins = this.report.sendToAllAdmin;

      if (this.report.today) {
        this.report.start_date = ''
        this.report.end_date = ''
      } else {
        report.start_date = this.report.start_date;
        report.end_date = this.report.end_date;
      }

      report.emails = [...this.emails.value.map(i => i.value)];

      if (this.sortedDoc.length > 0)
        report.doctor = this.sortedDoc[0].doctor.id;
      if (this.sortedPat.length > 0)
        report.patient = this.sortedPat[0].id;
      if (this.sortedStaff.length > 0)
        report.staff = this.sortedStaff[0].id;


      this.reportService.getCancellationReport(report).pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
              let progress = Math.round(event.loaded * 100 / event.total);
              this.progress.width = progress + '%';
              this.progress.completed = true;
              break;
            case HttpEventType.Response:
              this.downLoadFile(event.body, 'application/pdf');
              this.loading = false;
              this.progress.completed = false;
              f.reset();
              this.sortedStaff = [];
              this.sortedDoc = [];
              this.sortedPat = [];
              if (this.emails.value != undefined)
                this.emails.removeAllTags();
              return event;
          }
        }),
        catchError((err => {
          this.loading = false;
          this.progress.completed = false;
          return 'Download Failed !';
        }))
      ).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log("Done")
        }
      }
      )
    }
  }

  openDrawer(query, reportType) {
    if (query == 'staff') {
      this.reportQuery = 'Staff'
      this.reportType = reportType;
      this.report.today = false;
      this.report.sendToAllAdmin = false;
      if (this.emails.value != undefined)
        this.emails.removeAllTags();

    } else if (query == 'department') {
      this.reportQuery = 'Department'
      this.reportType = reportType;
      this.deptSevice.getDepartment(true).subscribe((res: any) => {
        this.departments = res.departments
      });
    } else if (query == 'daily') {
      this.reportQuery = 'Daily';
      this.reportType = reportType;
      if (this.emails.value != undefined)
        this.emails.removeAllTags();
      this.report.today = false;
      this.report.sendToAllAdmin = false;
    }
  }

  searchStaff(searchData) {
    this.loadingSearch = true;
    let data = searchData.target.value.toLowerCase();
    this.staffSer.searchStaff(data).pipe(
      take(1),
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filteredStaff = res.users.data;
        this.loadingSearch = false;
      },
      err => {
        this.loadingSearch = false;
      }
    );
  }

  searchDoc(searchData) {
    let data = searchData.target.value.toLowerCase();
    this.docSer.searchDoctors(data).pipe(
      take(1),
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filteredDoc = res.data;
        this.loadingSearch = false;
      },
      err => {
        this.loadingSearch = false;
      }
    );
  }
  searchPat(searchData) {
    let data = searchData.target.value.toLowerCase();
    this.patSer.searchPatients(data).pipe(
      take(1),
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filteredPat = res.data.data;
        this.loadingSearch = false;
      },
      err => {
        this.loadingSearch = false;
      }
    );
  }
  addStaff(data, i) {
    let staff = this.sortedStaff.find(i => i.name == data.name);
    if (!staff) {
      this.sortedStaff.push(data);
      $('#staff_search').val('');
    }

    this.filteredStaff = [];
  }
  addDoctor(data, i) {
    this.sortedDoc = [data];
    $('#doctor_search').val('');
    this.filteredDoc = [];
  }
  addPatient(data, i) {
    this.sortedPat = [data];
    $('#patient_search').val('');
    this.filteredPat = [];
  }
  deleteChipStaff(index, type) {
    if (type == 'staff')
      this.sortedStaff.splice(index, 1);
    else if (type == 'doc') {
      this.sortedDoc.splice(index, 1)
    } else if (type == 'pat') {
      this.sortedPat.splice(index, 1)
    }
  }


  private downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);

    const link = this.download.nativeElement;
    link.href = url;
    link.download = this.reportQuery + '_' + this.reportType + '_Rev_Report_' + new Date().getTime() + '.pdf';
    link.click();
  }
}
