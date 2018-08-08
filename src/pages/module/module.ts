import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-module',
  templateUrl: 'module.html'
})
export class ModulePage {
  module: any;
  currentEvent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an module available as a nav param
    this.module = navParams.get('module');
    this.currentEvent = navParams.get('event');
  }

}
