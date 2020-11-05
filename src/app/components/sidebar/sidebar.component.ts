import Scrollbar from 'smooth-scrollbar';
import { CookieService } from 'ngx-cookie-service';
import { StateService } from 'src/app/services/state.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit{
  sidebar: any;
  role;

  constructor(
    private stateService: StateService, 
    private cookie: CookieService) {
  }
  ngAfterViewInit(): void {
    $('.list-item').click(function(){
      $('.list-item').removeClass("active");
      $(this).addClass("active");
    });
  }

  ngOnInit(): void {
    $('#accordionExample').collapse({
      toggle: true
    });
    let options = {
      damping:0.1,
      continuousScrolling: true
    }
    Scrollbar.initAll(options);
    
    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];
    
    $('.list-item').click(function(){
      $('.list-item').removeClass("active");
      $(this).addClass("active");
    });

    $(document).ready(function(){
      $("#sidebarCollapse").click(function(){
        $("#sidebar").toggleClass('side-navbar-collapsed');
      });
    });
  }
  
  addActiveClass(event){
    let items = document.querySelectorAll(".icons");
    items.forEach(item => item.classList.remove('activeCategory'));
    let itemActive = event.target.parentElement;
    itemActive.classList.add('activeCategory');
  }

}
