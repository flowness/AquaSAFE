import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: 'page-notaleak',
  templateUrl: 'notaleak.html',
  animations: [
    trigger('elementState', [
      state('opaque', style({
        opacity: 1
      })),
      state('transparent', style({
        opacity: 0
      })),
      transition('opaque => transparent', animate('2000ms ease-in')),
      transition('transparent => opaque', animate('2000ms ease-in'))
    ])
  ]
})

export class NotALeakPage {
  alert: any;
  state = "opaque";

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public loadingCtrl: LoadingController) {
    this.alert = navParams.get('alert');
    console.log('navParams = ' + this.alert.detectionTime);
  }

  makeOpaque() {
    this.state = "opaque";
  }

  makeTransparent() {
    this.state = "transparent";
  }

  doConfirm(waterUsage) {
    this.state = this.state === "transparent" ? "opaque" : "transparent";
    // let alert = this.alertCtrl.create({
    //   title: 'Confirmation',
    //   message: 'Did the water usage detection done by the ' + waterUsage + '?',
    //   buttons: [
    //     {
    //       text: 'No',
    //       handler: () => {
    //         console.log('No clicked');
    //       }
    //     },
    //     {
    //       text: 'Yes',
    //       handler: () => {
    //         console.log('Yes clicked');
    //         let loading = this.loadingCtrl.create({
    //           content: 'Refreshing.', showBackdrop: false
    //         });
    //         this.updateModel(loading);
    //         this.navCtrl.pop();
    //       }
    //     }
    //   ]
    // });

    // alert.present();
    
  }

  updateModel(loading) {
    console.log('read model from storage');
    this.storage.get('model').then((val) => {
      if (val != null) {
        console.log('val.status = ' + val.status);
        val.status = 1;
        for (let index = 0; index < val.modules.length; index++) {
          val.modules[index].state = 'All Good';
        }
        console.log('set model in storage');
        this.storage.set('model', val);
      }
      loading.dismiss();
    });
  }

}
