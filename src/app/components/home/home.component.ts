import { CookieService } from 'ngx-cookie-service';
import { count, take } from 'rxjs/operators';
import { DashboardService } from './../../services/dashboard.service';
import { StateService } from 'src/app/services/state.service';
import { Component, OnInit, AfterContentInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};
export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

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
    current_month: '',
    today: ''
  };
  departments = [];
  holiday_doc = [];
  doctors;

  @ViewChild('chart') chart: ElementRef<HTMLDivElement>;
  public chartOptions: Partial<ChartOptions>;
  public donutChartOptions: Partial<DonutChartOptions>;
  public columnChartOptions: Partial<ColumnChartOptions>;

  constructor(
    private cookie: CookieService,
    private stateService: StateService,
    private dashboard: DashboardService) {
    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100],
          color: '#7cd6d4'
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41],
          color: "#fcb256"
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };

    this.donutChartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 340,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.columnChartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [
            {
              y: 10,
              x: 0,
              fillColor: '#fcb256',
            },
            {
              y: 45,
              x: 10,
              fillColor: '#fcb256',
            },
            {
              y: 20,
              x: 20,
              fillColor: '#fcb256',
            },
            {
              y: 90,
              x: 30,
              fillColor: '#fcb256',
            },
            {
              y: 60,
              x: 40,
              fillColor: '#fcb256',
            },
            {
              y: 80,
              x: 50,
              fillColor: '#fcb256',
            },
            {
              y: 90,
              x: 60,
              fillColor: '#fcb256',
            },
            {
              y: 100,
              x: 70,
              fillColor: '#fcb256',
            },
            {
              y: 110,
              x: 80,
              fillColor: '#fcb256',
            },
          ],
        },
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        type: "gradient",
        opacity: 1,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          gradientToColors: ["#fcb256", "#fcb2567a"],
          opacityTo: 0.9,
          type: "vertical",
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        fillSeriesColor: true,
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };


  }

  ngOnInit(): void {
    // this.dashboard.getDashboard().pipe(take(1)).subscribe(
    //   (res: any) => {
    //     this.patientCount = res.patients;
    //     this.departments = res.departments;
    //     this.appointments.current_month = res.appointments.current_month;
    //     this.appointments.today = res.appointments.today;
    //     this.holiday_doc = res.doctors_on_holiday;
    //     this.doctors = res.doctors;
    //     this.staff = res.staff;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // )
  }

  ngAfterViewInit() {
    am4core.useTheme(am4themes_animated);

    let container = am4core.create(this.chart.nativeElement, am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "vertical";

    this.createBulletChart(container, "solid");
  }

  /* Create ranges */
  createRange(axis, from, to, color) {
    let range = axis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.8;
    range.label.disabled = true;
    range.grid.disabled = true;
  }

  /* Create bullet chart with specified color type for background */
  createBulletChart(parent, colorType) {
    let colors = ["#7cd6d4", "#fcb256", "#7cd6d4", "#fcb256", "#7cd6d4", "#fcb256", "#7cd6d4", "#fcb256", "#7cd6d4", "#fcb256"];

    /* Create chart instance */
    let chart = parent.createChild(am4charts.XYChart);

    chart.paddingRight = 15;
    chart.paddingLeft = -20;
    chart.fontSize = 12;
    /* Add data */
    chart.data = [
      {
        "category": "O",
        "value": 85,
        "target": 85
      },
      {
        "category": "M",
        "value": 100,
        "target": 100
      },
      {
        "category": "A",
        "value": 55,
        "target": 55
      }
    ];

    /* Create axes */
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.numberFormatter.numberFormat = "#'k'";
    valueAxis.renderer.baseGrid.disabled = true;

    /* 
      In order to create separate background colors for each range of values, 
      you have to create multiple axisRange objects each with their own fill color 
    */
    if (colorType === "solid") {
      let start = 0, end = 20;
      for (var i = 0; i < 10; ++i) {
        this.createRange(valueAxis, start, end, am4core.color(colors[i]));
        start += 20;
        end += 20;
      }
    }
    /*
      In order to create a gradient background, only one axisRange object is needed
      and a gradient object can be assigned to the axisRange's fill property. 
    */
    else if (colorType === "gradient") {
      let gradient = new am4core.LinearGradient();
      for (var i = 0; i < 5; ++i) {
        // add each color that makes up the gradient
        gradient.addColor(am4core.color(colors[i]));
      }
      this.createRange(valueAxis, 0, 100, gradient);
    }

    /* Create series */
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.fill = am4core.color("#000");
    series.columns.template.stroke = am4core.color("#000");
    series.columns.template.strokeWidth = 1;
    series.columns.template.strokeOpacity = 0.5;
    series.columns.template.height = am4core.percent(10);
    series.tooltipText = "{value}"


    let series2 = chart.series.push(new am4charts.StepLineSeries());
    series2.dataFields.valueX = "target";
    series2.dataFields.categoryY = "category";
    series2.strokeWidth = 2;
    series2.noRisers = true;
    series2.startLocation = 0.15;
    series2.endLocation = 0.85;
    series2.tooltipText = "{valueX}"
    series2.stroke = am4core.color("#000");

    chart.cursor = new am4charts.XYCursor()
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    valueAxis.cursorTooltipEnabled = false;
    chart.arrangeTooltips = false;
  }

  public generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
