import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { asEvent } from '../../lib/interfaces';
import { EventStatus } from '../../lib/enums';
import { HandleLeakPage } from '../handle-leak/handle-leak';
import { EditEventPage } from '../edit-event/edit-event';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  asEvent: asEvent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.asEvent = navParams.get('event');
    console.log("event tapped");
    // console.dir(this.asEvent);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  isLiveEvent(e: asEvent): boolean {
    return e.status === EventStatus.LIVE;
  }

  handleAsEvent(e: asEvent): void {
    console.log("item type = " + e.status);
    if (e.status === EventStatus.LIVE) {
      this.navCtrl.push(HandleLeakPage, {
        event: e
      });
    } else {
      // alert("soon to be filled. status: " + e.status);
      this.openEditEventModal(e);
    }
  }

  openEditEventModal(e: asEvent): void {
    let myModal = this.modalCtrl.create(EditEventPage, {
      event: e
    });
    myModal.present();
  }
}
