import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from 'src/app/components/notification/notification.component';


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
