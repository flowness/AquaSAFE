import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { asEvent } from '../../lib/interfaces';

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
  private asEvent: asEvent;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.asEvent = navParams.get('event');
    console.log("event tapped");
    console.dir(this.asEvent);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

}
