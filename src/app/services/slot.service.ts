import { environment } from './../../environments/environment';
import { Slot } from './../models/slot.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  constructor(private http: HttpClient) { }

  getALlSlots(doctorId: number){
    return this.http.get(environment.endPoint + "/slots/doctor/" + doctorId)
  }
  getSlots(doctorId: number){
    return this.http.get(environment.endPoint + "/slots/doctor/"+ doctorId +"/available")
  }
  createSlots(slot){
    return this.http.post(environment.endPoint + "/slots", slot);
  }

  deleteSlot(slotId, password?: any){
    if(password !=null)
      return this.http.delete(environment.endPoint + "/slots/" + slotId + "?password=" + password, { observe: 'response' } );
    return this.http.delete(environment.endPoint + "/slots/" + slotId, { observe: 'response' });
  }
  editSlot(slotId, data){
    return this.http.put(environment.endPoint + "/slots/" + slotId, data, { observe: 'response' });
  }
}
