import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StatusEventService, Statuses, SystemStatusEvent } from "../../providers/StatusEvent-service";
import { GlobalsService } from "../../providers/Globals-service";
import { NotALeakPage } from "../events/notaleak/notaleak";
import { TranslateService } from '@ngx-translate/core';

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
              private globalsService: GlobalsService, 
              private translate: TranslateService,
              private statusEventService: StatusEventService) {
    this.eventID = navParams.get("eventID");
    this.theEvent = statusEventService.getEventList()[statusEventService.getSystemStatusEventIndexByID(this.eventID)];

    for (let i=0;i<this.theEvent.rollingSubEvents.length;i++)
      console.log('###### ' + this.theEvent.rollingSubEvents[i].Event_str)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  private closeEvent(): void {
    if (this.text == "")
      this.translate.get("DEFAULT_CLOSE_EVENT_STRING").subscribe(value => {this.text = value;});

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

  localTimeStamp(e: SystemStatusEvent): string {
    var timeoptions = { hourCycle: 'h24', year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit' };
    return new Date(e.epoch_timestamp).toLocaleDateString(this.globalsService.Language, timeoptions)
  }

  getStatusActionString(isOpen): string{
    if (isOpen) 
      return "EDIT_EVENT_DETAILS"
    else
      return "VIEW_EVENT_DETAILS"
  }
  private notALeak(): void {
    this.navCtrl.push(NotALeakPage, {
      eventID: this.eventID
    });
  }
}
