import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {


  state = {
    "disabled": true
  }

  refreshState = {
    "state": false 
  }

  deletedDoc = false;

  private approvalStageMessage = new BehaviorSubject(JSON.stringify(this.state));
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private approvalrefreshStateMessage = new BehaviorSubject(JSON.stringify(this.refreshState));
  currentApprovalrefreshStateMessage = this.approvalrefreshStateMessage.asObservable();

  private approvalDelDocMessage = new BehaviorSubject(JSON.stringify(this.deletedDoc));
  currentApprovalDelDocMessage = this.approvalDelDocMessage.asObservable();

  constructor() {

  }

  updateApprovalMessage(state) {
    this.state = state
    this.approvalStageMessage.next(JSON.stringify(state));
  }
  updateApprovalRefreshMessage(state) {
    this.state = state
    this.approvalrefreshStateMessage.next(JSON.stringify(state));
  }
  updateApprovalDelDocMessage(state) {
    this.state = state
    this.approvalDelDocMessage.next(JSON.stringify(state));
  }


}
