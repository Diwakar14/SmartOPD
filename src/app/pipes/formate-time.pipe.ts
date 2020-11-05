import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateTime'
})
export class FormateTimePipe implements PipeTransform {

  time: any;
  transform(value: string): unknown {
    this.time = value;
    this.time = this.time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [this.time];
    if (this.time.length > 1) { // If this.time format correct
      this.time = this.time.slice(1);  // Remove full string match value
      this.time[3] = +this.time[0] < 12 ? '<small>AM</small>' : '<small>PM</small>'; // Set AM/PM
      this.time[0] = +this.time[0] % 12 || 12; // Adjust hours
    }
    return this.time.join ('');
  }
}
