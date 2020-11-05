import { take } from 'rxjs/operators';
import { DashboardService } from './../../services/dashboard.service';
import { StateService } from 'src/app/services/state.service';
import { Component, OnInit, AfterContentInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var Highcharts: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  time = new Date().getTime();
  patientCount;
  staff;
  appointments = {
    current_month:'',
    today: ''
  };
  departments = [];
  holiday_doc = [];
  doctors;

  @ViewChild('chart') chart:ElementRef<HTMLCanvasElement>;
  constructor(
    private stateService: StateService, 
    private dashboard: DashboardService) { 
  }

  ngOnInit(): void {
    this.dashboard.getDashboard().pipe(take(1)).subscribe(
      (res: any) => {
        this.patientCount = res.patients;
        this.departments = res.departments;
        this.appointments.current_month = res.appointments.current_month;
        this.appointments.today = res.appointments.today;
        this.holiday_doc = res.doctors_on_holiday;
        this.doctors = res.doctors;
        this.staff = res.staff;
      },
      err => {
        console.log(err);
      }
    )
  }

  ngAfterViewInit(){
    // let chartContext = this.chart.nativeElement.getContext('2d');
    let dataitems = [];
    let data;
    this.dashboard.getDashboard().pipe(take(1)).subscribe(
      (res: any) => { 
        dataitems = res.departments;

        Highcharts.chart('myChart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: ''
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Doctors',
            colorByPoint: true,
            data: [...dataitems.map(i => { return {y:i.doctor_count, name:i.name}})]
          }]
        });
      }
    )


  }
}
