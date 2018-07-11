import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the R100Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-r100',
  templateUrl: 'r100.html',
})
export class R100Page {
  module: any;
  data: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.module = navParams.get('module');
    console.log("sn: " + this.module.sn);
    this.prepareData(this.module.sn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad R100Page');
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
