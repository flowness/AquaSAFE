import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StatusEventService, Statuses, SystemStatusEvent } from "../../providers/StatusEvent-service";

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {
  eventID: number;
  public text: string = "";
  theEvent: SystemStatusEvent;

  constructor(public viewCtrl: ViewController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private statusEventService: StatusEventService) {
    this.eventID = navParams.get("eventID");
    this.theEvent = statusEventService.getEventList()[statusEventService.getSystemStatusEventIndexByID(this.eventID)];

    for (let i=0;i<this.theEvent.rollingSubEvents.length;i++)
      console.log('###### ' + this.theEvent.rollingSubEvents[i].Event_str)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  closeEvent(): void {
    console.log ('@@@@@@ Closing event. EventID = ' + this.eventID + ', text = ' + this.text);
    this.statusEventService.closeStatusEvent(this.eventID, this.text);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getStatusEventString(isOpen): string {
    if (isOpen) 
      return "OPEN_EVENT"
    else
      return "CLOSED_EVENT"
  }

  getStatusActionString(isOpen): string{
    if (isOpen) 
      return "EDIT_EVENT_DETAILS"
    else
      return "VIEW_EVENT_DETAILS"
  }

}
