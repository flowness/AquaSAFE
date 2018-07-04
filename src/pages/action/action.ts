import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-action',
  templateUrl: 'action.html'
})
export class ActionPage {
  item: any;
  alert:  any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.item = navParams.get('item');
    this.alert = navParams.get('alert');
  }
}
