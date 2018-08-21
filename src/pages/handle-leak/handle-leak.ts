import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModelService } from '../../providers/model-service';
import { NotALeakPage } from '../events/notaleak/notaleak';
import { Page } from 'ionic-angular/umd/navigation/nav-util';
import { CantseeLeakPage } from '../events/cantseeleak/cantseeleak';
import { NotathomePage } from '../events/notathome/notathome';
import { IsALeakPage } from '../events/isaleak/isaleak';

/**
 * Generated class for the HandleLeakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-handle-leak',
  templateUrl: 'handle-leak.html',
})
export class HandleLeakPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modelService: ModelService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HandleLeakPage');
  }

  eventItemTapped(event: any, eventType: number): void {
    console.log("item type = " + eventType);
    this.navCtrl.push(this.getEventPage(eventType), {
      event: this.modelService.getLatestOpenEvent()
    });
  }

  getEventPage(eventType: number): Page {
    switch (eventType) {
      case 100:
        return NotALeakPage;
      case 101:
        return CantseeLeakPage;
      case 102:
        return NotathomePage;
      case 103:
        return IsALeakPage;
    }
  }



}
