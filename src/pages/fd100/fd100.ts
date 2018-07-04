import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Fd100Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fd100',
  templateUrl: 'fd100.html',
})
export class Fd100Page {
  selectedItem: any;
  data: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedItem = navParams.get('item');
    console.log("sn: " + this.selectedItem.sn);
    this.prepareData(this.selectedItem.sn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Fd100Page');
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
