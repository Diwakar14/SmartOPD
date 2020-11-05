import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { Login } from './../../models/login.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare var Notiflix: any;
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  login: Login = new Login();
  otpSend = false;
  submit = false;
  checking = false;
  forgotPassPanel: boolean = false;
  requestotpPanel = false;
  newPassPanel = false;
  verifyOtpPanel = false;

  constructor(private authService: AuthService,
    private cookie: CookieService, 
    private router: Router) { 
  }
  ngAfterViewInit(): void {
    if((parseInt(localStorage.getItem('isUser')) == 0) 
      && (this.cookie.get('auth_token') != null) 
      && (this.cookie.get('auth_token') != undefined)){
      this.router.navigateByUrl('/dashboard/home');
    }
  }

  ngOnInit(): void {
    
  }

  loginWithPhone(f: NgForm){
    this.checking = true;
    this.authService.login(this.login).subscribe(
      (res: any) => {
        this.otpSend = true;
        this.checking = false;
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.checking = false;
      }
    )
  }

  // structural function...
  forgortPass(){
    this.forgotPassPanel = true;
  }

  
  requestOTP(){
    this.requestotpPanel = true;
  }
  verifyOtp(){
    this.verifyOtpPanel = true;
  }

  new_password(){
    this.newPassPanel = true;
  }

  loginWithEmail(f: NgForm){
    this.submit = true;
    this.authService.loginWithEmail(this.login).subscribe(
      (res: any) => {
          this.submit = false;
          let auth_token = res.headers.get('authorization');
          let expire = res.headers.get('expires');

          var now = new Date();
          var time = now.getTime();
          var expireTime = time + (parseInt(expire)*10);
          now.setTime(expireTime);
          
          if(this.cookie.check('auth_token')){
            this.cookie.deleteAll();
          }

          this.cookie.set('auth_token', auth_token, now);
          localStorage.setItem('isUser', '1');
          Notiflix.Notify.Success("Logged in successfully.");
          this.router.navigate(['/dashboard/home']);
      },
      err => {
        Notiflix.Notify.Failure("Login failed.");
        this.submit = false;
        f.reset();
      }
    )
  }
}
