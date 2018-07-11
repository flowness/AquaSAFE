import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-mp100',
  templateUrl: 'mp100.html'
})
export class MP100Page {
  module: any;
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.module = navParams.get('module');
    console.log("sn: " + this.module.sn);
    this.prepareData(this.module.sn);
  }

  prepareData(serial) {
    let data1 = {};
    data1['sn'] = serial;
    data1['lastReading'] = new Date();
    data1['address'] = 'Haadarim St. Talmaz';
    data1['batteryStatus'] = Math.floor(Math.random() * 100);
    data1['tempC'] = Math.floor(Math.random() * 50) - 10;
    data1['tempF'] = Math.floor(data1['tempC'] * 1.8 + 32);
    this['data'] = data1;
  }
}
