import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-module',
  templateUrl: 'module.html'
})
export class ModulePage {
  item: any;
  alert: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.item = navParams.get('item');
    this.alert = navParams.get('alert');
  }

}
