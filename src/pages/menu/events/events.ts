import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})

export class eventsPage {
  items: Array<{title: string, timestamp: string, event: string, status: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.items = [];
    let thisDate=new Date();
    let numItems = Math.ceil(Math.random() * 8) + 5;

    for (let i = 0; i < numItems; i++) {
      thisDate=new Date(thisDate.getTime() + (1000* (Math.ceil(Math.random() *  60 * 60 * 24) + 1)));
      this.items.push({
        title: 'E-Mail',
        timestamp: thisDate.toISOString(),
        event: 'bad',
        status: Math.random()>0.5?'close-circle':'checkmark-circle'
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
