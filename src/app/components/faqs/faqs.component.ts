import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.btn-link').click(function(){
      $('.btn-link').removeClass("active-tab");
      $(this).addClass("active-tab");
    });
  }

}
