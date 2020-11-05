import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getStaffReport(report) {
    return this.http.post(environment.endPoint + "/reports/revenue/staff", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );
  }

  getDailyReport(report) {
    return this.http.post(environment.endPoint + "/reports/revenue/daily", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );
  }


  getInsantStaffRevReport(report) {
    return this.http.post(environment.endPoint + "/reports/instant/revenue/staff", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );

  }

  getInstantDailyRevReport(report) {
    return this.http.post(environment.endPoint + "/reports/instant/revenue/daily", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );
  }

  getCancellationReport(report) {
    return this.http.post(environment.endPoint + "/reports/cancellations", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );
  }

  getDailySummaryReport(report) {
    return this.http.post(environment.endPoint + "/reports/summary", report,
      { responseType: 'arraybuffer', reportProgress: true, observe: 'events' },
    );
  }



}
