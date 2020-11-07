import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';
declare var Notiflix: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(":enter", animate("2000ms ease-in", style({ opacity: 1 }))),
      transition(":leave", animate("2000ms ease-out", style({ opacity: 0 })))
    ])
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'SmartOPD Hospital';
  loading;
  constructor(private router: Router) {
    this.loading = false;
  }
  ngAfterViewInit(): void {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          setTimeout(() => {
            this.loading = true;
          })
          // this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          setTimeout(() => {
            this.loading = false;
          })
          // this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  ngOnInit(): void {

    Notiflix.Notify.Init({
      width: '400px',
      fontSize: '14px',
      timeout: 5000,
      messageMaxLength: 200,
      cssAnimation: true,
      cssAnimationDuration: 400,
      cssAnimationStyle: 'from-top',
    });
  }
}
