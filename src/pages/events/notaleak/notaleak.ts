import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-notaleak',
  templateUrl: 'notaleak.html'
})

export class NotALeakPage {
  alert: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public loadingCtrl: LoadingController) {
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
            let loading = this.loadingCtrl.create({
              content: 'Refreshing.', showBackdrop: false
            });
            this.updateModel(loading);
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
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
