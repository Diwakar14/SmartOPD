import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { 
  Router, 
  Event, 
  NavigationStart, 
  NavigationEnd, 
  NavigationCancel, 
  NavigationError 
} from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import Scrollbar from 'smooth-scrollbar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  loading = false;
  title;
  options;
  sidebar;

  constructor(private router: Router, 
    private cookie: CookieService,
    private stateService: StateService,) {

    }
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
