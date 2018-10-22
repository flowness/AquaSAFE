import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
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
  deviceLat: number;
  deviceLon: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private callNumber: CallNumber, private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.deviceLat = resp.coords.latitude;
      this.deviceLon = resp.coords.longitude;
      // this.lat = 32.567126;
      // this.lon = 34.961520;
      console.log("location: " + this.deviceLat + "/" + this.deviceLon);
      this.sortList();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.preparePlumbersList();
  }

  sortList(): void {
    for (let index = 0; index < this.closerPlumbers.length; index++) {
      let plumber = this.closerPlumbers[index];
      let distanceGrade = this.calculateDist(this.closerPlumbers[index]);
      this.closerPlumbers[index]["distanceGrade"] = distanceGrade;
      console.dir(plumber);
    }
    this.closerPlumbers = this.closerPlumbers.sort((plumber1, plumber2) => {
      if (plumber1.distanceGrade > plumber2.distanceGrade
      ) {
        return 1;
      }
      if (plumber1.distanceGrade < plumber2.distanceGrade) {
        return -1;
      }
      return 0;
    });
  }

  calculateDist(plumber: any): number {
    let latDist = Math.abs(plumber.lat - this.deviceLat);
    let lonDist = Math.abs(plumber.lon - this.deviceLon);
    let grade = Math.sqrt(Math.pow(latDist, 2) + Math.pow(lonDist, 2));
    return grade;
  }

  preparePlumbersList(): void {
    this.closerPlumbers = [
      { name: "האינסטלטור", phone: "054-4771881", lat: 32.467770, lon: 34.959740 },
      { name: "עופר - יצאת צדיק", phone: "052-9116345", lat: 32.567126, lon: 34.961520 },
      { name: "דוידי שרברבים", phone: "052-3716000", lat: 32.567126, lon: 34.961520 },
      { name: "משה צינורות", phone: "054-4275844", lat: 32.447451, lon: 34.978796 },
      { name: "כהן אינסטלציה", phone: "051-2341209", lat: 32.567127, lon: 34.961521 },
      { name: "יהודה מלול", phone: "050-5629521", lat: 32.567186, lon: 34.961540 },
      { name: "מומנטום", phone: "054-2276994", lat: 32.567426, lon: 34.961020 }
    ];
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
