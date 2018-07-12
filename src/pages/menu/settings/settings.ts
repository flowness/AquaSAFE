import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public loadingCtrl: LoadingController) {
    this.items = [];
    this.items.push({
      title: 'E-Mail',
      input: 'text',
      icon: 'mail',
      value: ''
    });
    this.items.push({
      title: 'SMS',
      input: 'text',
      icon: 'call',
      value: ''
    });
    this.items.push({
      title: 'Freeze Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Irregularity Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Leakage Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Zero-Flow Hours Alert:',
      input: 'toggle',
      icon: 'warning',
      value: false
    });

    this.items.push({
      title: 'Liters/Gallons',
      input: 'toggle',
      icon: 'water',
      value: false
    });

  }

  handleToggleChange(evt, item) {
    if (item.title === 'Leakage Alert') {
      console.log("setting leakage alert to " + item.value);
      let loading = this.loadingCtrl.create({
        content: 'Refreshing.', showBackdrop: false
      });
      this.updateModel(loading, item.value)
    }
  }

  updateModel(loading, isLeak) {
    console.log('read model from storage');
    this.storage.get('model').then((val) => {
      if (val != null) {
        console.log('val.status = ' + val.status);
        val.status = isLeak ? 2 : 1;
        for (let index = 0; index < val.modules.length; index++) {
          if (val.modules[index].type ===0) {
            val.modules[index].state = isLeak ? 'Leak Detected' : 'All Good';
          }
        }

        let alert = {};
        alert['indicator'] = 'MP100';
        alert['detectionTime'] = new Date().toISOString();
        val.alert = alert;

        console.log('set model in storage');
        console.dir(val);
        this.storage.set('model', val);
      }
      loading.dismiss();
    });
  }
}
