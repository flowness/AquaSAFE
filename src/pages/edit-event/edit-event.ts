import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { asEvent } from '../../lib/interfaces';
import { ModelService } from '../../providers/model-service';

/**
 * Generated class for the EditEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {
  theEvent: asEvent;
  public text: string = "";

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private modelService: ModelService) {
    this.theEvent = navParams.get("event");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  closeEvent(): void {
    this.modelService.closeEvent(this.theEvent.id, this.text);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
