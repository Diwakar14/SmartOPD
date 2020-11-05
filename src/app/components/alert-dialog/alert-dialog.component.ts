import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    private cookie: CookieService,
    private router: Router,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
  }

  confirm(){
    this.logout();
  }

  logout(){
    this.loading = true;
    this.authService.logOut().pipe().subscribe(
      res => {
        this.cookie.delete('auth_token');
        this.cookie.delete('role');
        this.cookie.deleteAll();

        localStorage.setItem('isUser', '0');
        this.loading = false;
        this.dialogRef.close();
        this.router.navigate(['/login']);
      }
    )
  }

}
