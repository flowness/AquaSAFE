import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the PlumbersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plumbers',
  templateUrl: 'plumbers.html',
})
export class PlumbersPage {
  closerPlumbers: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private callNumber: CallNumber) {
    this.preparePlumbersList();
  }

  preparePlumbersList() {
    this.closerPlumbers = [{ name: "Yossi", phone: "054-4275844" }, { name: "Hagay", phone: "054-4771881" }, { name: "Noam", phone: "052-3716000" }];
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad PlumbersPage');
    console.dir(this.closerPlumbers);
  }

  call(event: any, plumber: any): void {
    console.log("calling = " + plumber.name);
    this.callNumber.callNumber(plumber.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
