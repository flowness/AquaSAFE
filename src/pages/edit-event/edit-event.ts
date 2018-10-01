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
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  closeEvent(): void {
    this.statusEventService.closeStatusEvent(this.eventID, this.text);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
