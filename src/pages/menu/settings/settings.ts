import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;
  statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];

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
    if (item.title === 'Leakage Alert' || item.title === 'Irregularity Alert') {
      console.log("setting leakage alert to " + item.value);
      let loading = this.loadingCtrl.create({
        content: 'Refreshing.', showBackdrop: false
      });
      this.updateModel(loading, item)
    }
  }

  updateModel(loading, item) {
    console.log('read model from storage');
    console.dir(item);
    this.storage.get('model').then((val) => {
      if (val != null) {
        console.log('val.status before = ' + val.status);
        console.log('item.title = ' + item.title);
        val.status = item.value === 0 ? 1 : (item.title === 'Leakage Alert' ? 2 : 3);
        console.log('val.status after = ' + val.status);
        if (item.title === 'Leakage Alert') {
          for (let index = 0; index < val.modules.length; index++) {
            if (val.modules[index].type === 0) {
              val.modules[index].state = item.value ? 'Leak Detected' : 'All Good';
            }
          }
        }
        if (item.title === 'Irregularity Alert') {
          for (let index = 0; index < val.modules.length; index++) {
            val.modules[index].state = this.statuses[Math.floor(Math.random() * this.statuses.length)];
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
