import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-notaleak',
  templateUrl: 'notaleak.html'
})
export class NotALeakPage {
  alert: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.alert = navParams.get('alert');
    console.log('navParams = ' + this.alert.detectionTime);
  }

  doConfirm(waterUsage) {
   let alert = this.alertCtrl.create({
     title: 'Confirmation',
     message: 'Did the water usage detection done by the ' + waterUsage + '?',
     buttons: [
       {
         text: 'No',
         handler: () => {
           console.log('No clicked');
         }
       },
       {
         text: 'Yes',
         handler: () => {
           console.log('Yes clicked');
           this.navCtrl.pop();
         }
       }
     ]
   });

   alert.present();
 }

}
