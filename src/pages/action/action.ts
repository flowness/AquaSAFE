import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-action',
  templateUrl: 'action.html'
})
export class ActionPage {
  item: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.item = navParams.get('item');

  }

  doConfirm(title) {
   let alert = this.alertCtrl.create({
     title: title,
     message: 'Do you currently use the ' + title + '?',
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
