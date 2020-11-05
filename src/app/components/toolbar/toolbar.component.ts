import { delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { StateService } from './../../services/state.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  name;
  title;
  dashboard;
  sidebarToggle = false;
  fullscreen = '../../../assets/img/toolbar/fullscreen-black-36dp.svg';
  loading: boolean;
  constructor(private authService: AuthService,
    private cookie: CookieService,
    private stateService: StateService,
    private dialog: MatDialog,
    private router: Router) {
    this.name = this.cookie.get('username');
   }

  ngOnInit(): void {
    this.stateService.currentApprovalStageMessage.subscribe((res: any) => {
      let data = JSON.parse(res);
      this.title = data.toolbarTitle;
    })
  }

  openFullscreen() {
    this.dashboard = document.querySelector('body');
    if (document.fullscreenElement) { 
      document.exitFullscreen()
        .then(() => {
          this.fullscreen = '../../../assets/img/toolbar/fullscreen-black-36dp.svg';
        })
    } else { 
      document.documentElement.requestFullscreen();
      this.fullscreen = '../../../assets/img/toolbar/fullscreen_exit-black-36dp.svg';
    } 
  }
  

  sidebar(){
    
  }

  confirmLogOut(){
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      id: 'alert',
      disableClose: true
    });
  }

  
}
