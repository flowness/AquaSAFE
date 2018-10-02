import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//import { asEvent, eventMoment } from '../../lib/interfaces';
//import { EventStatus } from '../../lib/enums';
import { HandleLeakPage } from '../handle-leak/handle-leak';
import { EditEventPage } from '../edit-event/edit-event';
import { NotALeakPage } from '../events/notaleak/notaleak';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StatusEventService, Statuses, SystemStatusEvent } from "../../providers/StatusEvent-service";

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  statusEvent: SystemStatusEvent;
  eventID: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http) {
    this.eventID = navParams.get('eventID');
    //this.refreshMomentsData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  handleAsEvent(e: SystemStatusEvent): void {
    console.log("item type = " + e.status);
    if (e.status === Statuses.LIVE) {
      this.navCtrl.push(HandleLeakPage, { eventID: e.event_ID });
    } else {
      // alert("soon to be filled. status: " + e.status);
      this.openEditEventModal(e.event_ID);
    }
  }

  handleNotALeak(e: SystemStatusEvent): void {
    this.navCtrl.push(NotALeakPage, { eventID: e.event_ID });
  }

  openEditEventModal(eventID: number): void {
    let myModal = this.modalCtrl.create(EditEventPage, { eventID: eventID });
    myModal.present();
  }
}
